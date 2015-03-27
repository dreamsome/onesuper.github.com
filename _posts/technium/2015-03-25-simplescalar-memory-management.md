---
layout: post
title: "SimpleScalar源代码分析(2)：内存管理"
---


（两年前的笔记，如果有空还是想完成这个系列的。）


内存部分的代码位于 [memory.c](https://github.com/onesuper/SimpleScalar/blob/master/memory.c) 和 [memory.h](https://github.com/onesuper/SimpleScalar/blob/master/memory.h) 文件中。SimpleScalar 在模拟分页机制时使用了反向页表，示意图如下：


![](http://ww4.sinaimg.cn/mw690/534218ffjw1e6nkrn1fr6j20bi08wt94.jpg)


一个地址由两部分构成：逻辑页号和页內偏移。CPU 在访问某个地址时，首先会根据逻辑页号去页表中查找物理页号，然后根据物理页号和页內偏移计算出物理地址。



### 物理页

因为 SimpleScalar 是一个软件模拟器，因此所谓的物理页其实就是主机中的一段内存空间，而物理页号就是一个 char 指针<sup>[1]</sup>。


每次调用 [mem_newpage()](https://github.com/onesuper/SimpleScalar/blob/master/memory.c) 创建新的页面，SimpleScalar 都会在堆上创建一个大小为 `MD_PAGE_SIZE`<sup>[2]</sup>的页面，然后新建一个页表项，插入到页表中，并将 `page_count` 加一。


### 内存对象

[Memory](https://github.com/onesuper/SimpleScalar/blob/master/memory.h) 对象中包含了一个指针数组 `ptab[]`（也就是页表），和三个计数器，分别记录了页表总数、页表失效数和页表访问总数。

{% highlight c %}
struct mem_t {
  struct mem_pte_t *ptab[MEM_PTAB_SIZE]; /* 反向页表 */
  counter_t page_count;			/* 分配页表总数 */
  counter_t ptab_misses;		/* 页表失效数  */
  counter_t ptab_accesses;		/* 页表访问总数 */
};
{% endhighlight %}


### 页表项

为了节约空间，SimpleScalar 将页表项（page table entry, PTE）组织成哈希表的形式，因此多个页表项可能映射到同一个桶中，因此每个页表项中还需要存一个 tag 域来解决碰撞，同一个桶中的页表项存成链表（collision chain），因此还需要一个 next 域。


{% highlight c %}
struct mem_pte_t {
  struct mem_pte_t *next;	/* 同一个桶中的下一个 PTE */
  md_addr_t tag;		    /* 虚拟页号的标签 */
  byte_t *page;			    /* 物理页指针 */
};
{% endhighlight %}



### 地址翻译


地址翻译的过程如下： 

1. 在地址中提取出虚拟页码
2. 将虚拟页码转映射到哈希表的某个桶中
3. 将虚拟页码与桶中所有页表项的 tag 一一进行比较
4. 如果匹配，说明这个页表项中保存了实际的物理地址


![](http://ww1.sinaimg.cn/mw690/534218ffjw1e6nsvhmre4j20ca05s3yq.jpg)



### 统计页表失效


SimpleScalar 在虚实地址映射的过程中还完成了页表失效的模拟。


`MEM_PAGE(MEM, ADDR)` 接收一个内存对象 MEM 和一个虚拟地址 ADDR。它先尝试匹配桶中的第一个页表项，如果匹配就返回物理页，反之，调用 `mem_translate()` 进行查找。


{% highlight c %}
#define MEM_PAGE(MEM, ADDR)						\
  (/* 将地址映射到散列表中，并尝试匹配链表第一项 */	\
   ((MEM)->ptab[MEM_PTAB_SET(ADDR)]					\
    && (MEM)->ptab[MEM_PTAB_SET(ADDR)]->tag == MEM_PTAB_TAG(ADDR))	\
   ? (/* 如果 tag 匹配，代表命中，返回页号 */			\
      (MEM)->ptab_accesses++,						\
      (MEM)->ptab[MEM_PTAB_SET(ADDR)]->page)				\
   : (/* 失效，调用 tanslate 函数，进行接下来的翻译  */	\
      mem_translate((MEM), (ADDR))))
{% endhighlight %}


如果调用了 `mem_translate()`，就说明该地址的页表项不在链表首项，因此要将 `ptab_misses`（失效次数）加一，然后沿着链表查找页表项，找到后并不马上返回物理页号，而是先将该页表项插到链表头。无论是否命中，`ptab_accesses` 的值都需要加一。


{% highlight c %}
byte_t *
mem_translate(struct mem_t *mem, md_addr_t addr)		
{
  mem->ptab_misses++; mem->ptab_accesses++;
  /* 沿着链表查找页表项 */
  for (...) {
    if (/* tag匹配 */) {
	  /* 插到链表头 */
	  return pte->page;
	}
  }
  /* 没找到  */
  return NULL;
}
{% endhighlight %}


### 内存访问器


内存访问的核心是 [mem_access()](https://github.com/onesuper/SimpleScalar/blob/master/memory.c) 函数，它负责在主机内存和虚拟内存之间拷贝数据。`mem_access()` 可以访问从起始地址 `addr` 开始连续 `nbytes` 的字节，`nbytes`必须为 2 的指数倍 ，而且不能超过页大小，否则会报错，同时 `addr` 必须也为 2 的指数倍。<sup>[3]</sup>


事实上是，`mem_access()` 是一个访问器，通过它可以构造出更复杂的内存访问函数（通过函数指针），用它构造的函数有：


1. `mem_strcpy()`: 将主机端某个字符串拷贝至 SimpleScalar 模拟的内存空间
2. `mem_bcopy()`: 将连续 n 个字节拷贝至 SimpleScalar 模拟的内存空间
3. `mem_bcopy4()`: 将连续 n 个字节拷贝至 SimpleScalar 模拟的内存空间，但 n 必须是 4 的倍数。
4. `mem_bzero()`: 将 n 个 0 拷贝至 SimpleScalar 模拟的内存空间




### 内存为什么要分页？


程序在运行时需要使用内存资源，当系统中存在多个进程时，操作系统就需要协调好内存的分配。一种分配方式是**连续分配**，即每次把内存中一段连续的空间分配给某个进程，但是随着进程进进出出，内存中可能会出现无法利用的碎片<sup>[4]</sup>。分页（paging）机制以**页**为最小单位分配内存，一个进程分到的页在内存中可以不连续，它提高了内存分配的灵活性，但多出了一个将虚拟地址翻译（translate）为物理地址的步骤。


### 什么是反向页表？


之所以要用页表是因为我们要把一个虚拟地址翻译为一个物理地址，最直接的想法就是用一个数组来记录（也就是正向页表），但这样页表就太大了。而反向页表（inverted page table）只记录分配了物理页的页表项，并以哈希表的形式进行储存。实际上，SimpleScalar 中页表的作用相当于在主机内存中跟踪哪些片段是自己模拟出来的。


### 什么是 TLB？


通常进程的页表和指令计数器一起存放在进程控制块中，在访问物理内存前，先要先访问一次内存中的页表项，相当于访存速度减半。为了提高页表项的访存速度，现代机器大都采用 TLB（Translation Look-aside buffer）来加速，也就是把最近使用过的页表项缓存起来，提高翻译速度，因此 TLB 可以看成一个为页表项而设的 Cache。




### Notes

1. 定义在 [host.h](https://github.com/onesuper/SimpleScalar/blob/master/host.h) 文件中。
1. 页大小为 8KB，定义在 [machine.h](https://github.com/onesuper/SimpleScalar/blob/master/machine.h) 文件中。
1. [Data alignment: Straighten up and fly right](http://www.ibm.com/developerworks/library/pa-dalign/)
1. 一个形象的比喻就是[银行](http://blog.chengyichao.info/2010/11/17/memory-management/)。
