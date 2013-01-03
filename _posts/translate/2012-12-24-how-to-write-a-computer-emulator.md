---
layout: page
title: "怎样编写计算机仿真器"

---


* 作者：Marat Fayzullin
* 原文：[How To Write a Computer Emulator](http://fms.komkon.org/EMUL8/HOWTO.html)
* 翻译：[onesuper](http://blog.chengyichao.info)


---

你决定要写一个软件仿真器吗？好极了，这篇文档可能对你有帮助，它涵盖了人们在写仿真器时会提出的一些常见技术问题，同时它也给你了一张模拟器内部的“蓝图”，对你写仿真器多少会有帮助。


### 什么东西可以仿真？


基本上只要有微处理器的东西都可以被仿真，当然了，只有那些用来运行软件的设备才值得去仿真，包括：


* 计算机
* 计算器
* 电子游戏机
* 街机
* 等等


<span class="sidenote">* 译者注：Commodore Aimga 一款功能强大的游戏机，其性能赶上甚至超过了同时代的 PC。</span>
有必要指出你可以仿真**任何**计算机系统，即使它很复杂（例如 Commodore Amiga 计算机 \*），不过仿真的性能会非常差。


### 什么是“仿真”？它和“模拟”有什么区别？


<span class="sidenote">* 译者注：ROM 是指保存硬件“系统”代码的只读存储器。</span>
仿真（emulate）的目标是模仿设备的内部设计，而模拟（simulate）旨在模拟设备的功能。举个例子，在一个模拟 Pacman 街机硬件的程序上跑 Pacman ROM \* 就是一个仿真器，而仿照街机的画面在计算机上写出来的 Pacman 游戏就是模拟器。

### 仿真有专利的硬件是否合法？


这个问题的答案模棱两可，但只要你通过合法途径获取信息，那么即使仿真有专利的硬件也是合法的。但要注意，若你在发布仿真器的同时发布了有版权保护的系统 ROM（BIOS 等）是非法的。


### 什么是“解释型”仿真器？它和“重新编译型”仿真器有什么区别？

你可以使用三种基本模式来实现仿真器，为了得到最佳效果，你可以组合使用这三种模式。

#### 解释型

仿真器从存储器逐个字节读取仿真器的代码，解码，然后对仿真寄存器、存储器、输入输出设备执行相应的命令。这一类仿真器的通用算法如下：


{% highlight c %}
while(CPUIsRunning)
{
    Fetch OpCode
    Interpret OpCode
}
{% endhighlight %}


这个模型的优点在于便于调试、移植性好、好同步（很容易就能数出过了多少个时钟周期，然后用它来控制仿真器。）


但它有一个很明显弱点，性能差。解释需要占用很多 CPU 时间，为了让代码跑出像样的速度，你可能需要一台很好的计算机。



#### 静态重新编译型

利用这种技术，你可以把仿真程序翻译成计算机的汇编代码，最后你将得到一个可执行文件，你可以在你的计算机上运行，无需任何特殊工具。虽然静态重新编译听起来不错，但它并非总是可行，例如，如果一个会修改自己的程序，你就没有办法静态重新编译，因为你不知道它会变成什么样，除非你运行它。为了防止这种情况，你可以把静态重新编译器和解释器或动态编译器合在一起使用。


#### 动态重新编译行

动态和静态重新编译本质上是一回事，只是它发生在程序执行时。它并不会一次编译全部的代码，而是在遇到 CALL 或 JUMP 指令时动态地编译代码。为了提高速度，这种技术可以和静态重新编译合在一起用。关于动态重新编译的更多内容，你可以阅读 [Ardi 的白皮书](http://www.ardi.com/synpaper.php)，Macintosh 的重新编译型仿真器就是它发明的。


### 如果我想写仿真器，应该从哪里入手？


为了写仿真器，你必须掌握计算机编程和数字电路。如果你写过汇编程序，也会非常有帮助。

1. 选择一种编程语言。
2. 找到和要仿真的硬件相关的一切信息。
3. 实现一个 CPU 仿真器或找一份现成的代码。
4. 写一些仿真其他硬件的代码，至少要写一部分。
5. 这时，写一个内置的小调试器会很有帮助，它可以停止仿真然后看到程序在做什么，你可能还需要一个目标系统汇编语言的反汇编器，如果没有就自己写一个。
6. 试着在你的仿真器上运行程序。
7. 使用反汇编器和调试器观察程序如何使用硬件，合理调整代码。



### 应该用什么编程语言？


C 和汇编是首选，它们各自的利弊如下：


#### 汇编语言

\+ 生成代码的速度通常比较快。<br>
\+ 仿真 CPU 的寄存器可以直接保存在运行仿真器的 CPU 的寄存器中。<br>
\+ 很多操作码可以用运行仿真器的 CPU 的操作码来仿真。<br>
\- 代码不可移植，不能在不同的体系结构上运行。<br>
\- 代码难以调试和维护。


#### C

\+ 代码可以移植，能在不同的计算机和操作系统上运行。<br>
\+ 调试和维护相对比较容易。<br>
\+ 对硬件的工作行为的假设比较容易检验。<br>
\- C 通常比纯汇编代码慢。


### 上哪弄要仿真的硬件的信息？

下面列出了一些你可能想要

### 新闻组

* **comp.emulators.misc** <br> 这个新闻组专门用来讨论有关计算机仿真的问题，很多仿真器作者都读它，虽然它有点吵。发言前请先阅读它的 FAQ。
* **comp.emulators.game-consoles** <br> 和 comp.emulators.misc 很像，但针对电子游戏设备的模拟，发言前阅读 comp.emulators.misc 的 FAQ。
* **comp.sys./emulated-system/** <br> comp.sys.\* 下是特定型号的计算机，阅读这个新闻组，你可能会得到很多有用的技术信息。在这些讨论组发言之前请先阅读相关的 FAQ。
* **alt.folklore.computers**
* **rec.games.video.classic**


#### FTP

* [Console and Game Programming](ftp://x2ftp.oulu.fi/ )
* [Arcade Videogame Hardware](ftp://ftp.spies.com/)
* [Computer History and Emulation](ftp://ftp.komkon.org/pub/EMUL8/)


#### WWW

* [我的主页](http://www.komkon.org/fms/)
* [Arcade Emulation Programming Repository](http://valhalla.ph.tn.tudelft.nl/emul8/arcade.html)
* [Emulation Programmer's Resource ](http://www.classicgaming.com/EPR/)

### 如何仿真 CPU？

首先，如果你只需要仿真一个标准的 Z80 或 6502 CPU，你可以用[我写的 CPU 仿真器](http://www.komkon.org/fms/EMUL8/)。不过它们的适用范围有限。


如果你想自己写一个 CPU 仿真器核心，或对它们如何工作感兴趣，下面我给出了一个典型的 CPU 仿真器框架。在实际的仿真器中，你可能跳过其中某些部分或添加一些自己的代码。


{% highlight c %}
Counter = InterruptPeriod;
PC = InitialPC;

for (;;)
{
    OpCode = Memory[Pc];
    Counter -= Cycles[OpCode];
    
    switch (OpCode)
    {
        case OpCode1:
        case OpCode2:
        ...
    }
    
    if (Counter <= 0)
    {
        /* 检查中断或做其它事 */
        /* 这里是循环任务 */
        ...
        Counter += InterruptPeriod;
        if (ExitRequired) break;
    }
}
{% endhighlight %}


首先我们为 CPU 时钟周期计数器（Counter）和程序计数器（PC）赋初值：


{% highlight c %}
Counter = InterruptPeriod;
PC = InitialPC;
{% endhighlight %}    



Counter 中保存了距离下一次中断还有多少个 CPU 时钟周期，注意当 Counter 减为 0 中断并不一定发生：利用这点你可以很多其他事，例如同步计时器，更新屏幕的扫描行，稍候我会细讲。PC 中保存了一个存储器地址，仿真的 CPU 将从该地址中读出下一个操作码（opcode）。


赋完初始值，我们开始主循环：


{% highlight c %}
for (;;)
{
{% endhighlight %}


你也可以这样实现循环：


{% highlight c %}
while (CPUIsRunning)
{
{% endhighlight %}


这里的 CPUIsRunning 是一个布尔型变量，这么做的好处是你可以随时把 CPUIsRunning 设为 0 来结束循环。不幸的是，每次都在循环中检查这个变量都会占用很多的 CPU 时间，如果可以最好别这样做。另外，**不要**这样实现循环：


{% highlight c %}
while (1)
{
{% endhighlight %}


因为在这个例子中，有的编译器会生成“检查 1 是否为真”的代码，你可不希望编译器每次循环时都做无用功。


现在，我们进入了循环，第一件事就是读取下一个操作码，然后修改程序计数器：


{% highlight c %}
OpCode = Memory[Pc];
{% endhighlight %}


注意，尽管这是仿真器“从存储器读取数据”最简单、也是最快速的方法，但它**不总是可行**，关于访问存储器更通用的方法，我稍后会提。


取出操作码后，我们将 CPU 时钟周期计数器减去这个操作码所需时间：


{% highlight c %}
Counter-=Cycles[OpCode];
{% endhighlight %}


Cycles[] 表中保存了所有操作码所需花费的 CPU 时钟周期数。**小心**，某些操作码（例如条件转移或子例程调用）花费的时钟周期数会根据参数的变化而变化，不过这可以在后续的代码中调整。


接着是解释操作码并执行：


{% highlight c %}
switch (OpCode)
{
{% endhighlight %}


一个常见的误区是认为 switch() 结构的效率低，因为它会编译成一连串的 if() .. else if().. 语句。没错，当条件数很少时，switch() 结构的确会编译为一连串的 if 语句，但如果超过 100 个，就会编译成一个跳转表，这样效率就会很高。



解释操作码的方法有两种。一种是建一张函数表，根据它调用相应函数，这种方法的效率比 switch() 低，因为函数调用会带来额外开销（overhead）。另一种是建一张标签（label）表，然后用 goto 语句跳到相应标签，虽然这种方法比 switch() 更快，但只有那些提供了“预计算标签”的编译器才能使用，其他编译器不允许你创建标签地址的数组。


当我们解释完操作码并执行相应操作之后，是时候检查一下是否需要中断了。这时你还可以执行那些需要和系统时钟同步的任务：


{% highlight c%}
if (Counter <= 0)
{  
    /* 检查中断，进行一些其他的硬件模拟 */
    ...
    Counter += InterruptPeriod;
    if (ExitRequired) break;
}
{% endhighlight %}


循环任务一会儿再说。


注意，我们不仅仅令 Counter = InterrputPeriod，而是用 Counter += InterruptPeriod：这样时钟周期计数才精确，因为 Counter 中保存的时钟周期数可能是负的。


再来看这行：


{% highlight c%}
if (ExitRequired) break;
{% endhighlight %}


因为在每遍循环中检查退出的代价实在太大，所以我们只在 Counter 减到 0 以下时检查： 当你把 ExitRequired 设为 1 时不但能退出仿真，而且不会花费太多的 CPU 时间。



### 如何处理对仿真存储器的访问？


访问仿真存储器最简单的方式就是把存储器当作一个字节（或字，等等）数组来处理，这样访问起来就容易了：


{% highlight c%}
Data = Memory[Address1]; /* 从 Address1 读取数据 */
Memory[Address2] = Data; /* 把数据写到 Address2  */
{% endhighlight %}


这样虽然很简单，但并不总是成立，原因有以下几个：


* **页式存储器** <br> 存储器的地址空间可能划分为了可交换页（也叫块），这么做通常是为了在地址空间很小（64 KB）时增加存储器空间。
* **镜像存储器** <br>  <span class="sidenote">译者注：<a href="http://wiki.intellivision.us/index.php?title=Incomplete_Address_Decoding">不完全地址解码</a></span>同一块存储器区域可能可以在多个不同的地址访问到，例如你写到 $4000 号存储器单元的数据可能出现在 $6000 和 $8000 号单元。如果使用了不完全地址解码 *，ROM 也有可能有镜像。 
* **ROM 保护** <br> 一些卡带式软件（例如 MSX游戏）会往自己的 ROM 中写数据，如果成功，它就会停止工作，这么做通常是为了保护版权。为了让这样的软件能在你的仿真器上工作，你必须屏蔽往 ROM 写数据的功能。
* **存储器映射输入/输出** <br> <span class="sidenote">译者注：存储器映射输入/输出是CPU 和外设通信的一种渠道</span> 系统中可能有存储器映射输入/输出设备，访问这样的存储器单元会产生“特殊效果”，因此需要追踪这样的读写操作。



为了解决这些问题，我们引入两个函数：


{% highlight c%}
Data = ReadMemory(Address1);  /* 从 Address1 读取数据 */
WriteMemory(Address2,Data); /* 往 Address2 写数据 */
{% endhighlight %}


所有特殊的处理，例如对页的访问、镜像、I/O 处理等等都放到这些函数中去完成。


ReadMemory() 和 WriteMemory() 通常会给仿真器带来大量额外开销，加上它们的调用频率很高，所以必须足够高效才行。下面这个例子中的函数访问了分页的地址空间：


{% highlight c%}
static inline byte ReadMemory(register word Address)
{
    return(MemoryPage[Address>>13][Address&0x1FFF]);
}

static inline void WriteMemory(register word Address,register byte Value)
{
    MemoryPage[Address>>13][Address&0x1FFF]=Value;
}
{% endhighlight %}


**注意** inline 关键字，它告诉编译器：把函数嵌入代码中，而不是调用它们，如果你的编译器不支持 inline 或 _inline，可以用 static 关键字：有的编译器（例如 WatcomC）会优化 static，把函数嵌入代码。


同时记住，在绝大多数情况中调用 ReadMemory() 的频率要比调用 WriteMemory() 高出几倍，因此不妨把更多的代码放到 WriteMemory() 中去实现，而让 ReadMemory() 尽可能简短。 



#### 注释：存储器镜像
正如前面所说，很多计算机都有镜像 RAM，写到某个存储器单元的值可能出现在其他单元中。虽然这种情况可以在 ReadMemory() 中处理，但最好别这么做，因为 ReadMemory() 的调用频率比 WriteMemory() 高， 在 WriteMemory() 函数中实现存储器镜像更高效。


### 什么是循环任务？

循环任务（cyclic task）是仿真机中定期发生的事件，例如：


* 屏幕刷新
* <span class="sidenote">译者注：VBlank：水平回扫；HBlank：垂直回扫</span>VBlank 和 HBlank 中断 *
* 更新计时器
* 更新声音参数
* 更新键盘/手柄状态
* 等等


为了仿真这些任务，你必须让它们每过一个固定的 CPU 时钟周期就发生一次，比如假设 CPU 的主频为 2.5MHz 而显示器的刷新率为 50HZ（PAL 视频标准），那么 VBLANK 中断就应该每隔 2500000/50 = 50000 个 CPU 时钟周期发生一次。


现在假设整个屏幕（VBlank）有 256 行高，实际显示了其中的 212 行（剩下的 44 行需要垂直回扫），那么我们就可以得到仿真器必须每隔 50000/256 ~= 195 个 CPU 时钟周期内刷新一行。


这样，你就应该在 (256-212)\*50000/256 = 44*50000/256 ~= 8594 个 CPU 时钟周期内产生一个 VBlank 中断，并等待 VBlank 完成工作，这期间什么都不做。


仔细计算每项任务所需的 CPU 时钟周期数，然后用它们的**最大公约数**作为 InterruptPeriod，，所有的循环任务每隔这段时间就会进行检查（但不一定会在每次 Counter 减为 0 时都执行）。


### 如何优化 C 代码？

首先使用正确的编译优化选项可以大大提高代码的性能，根据我的经验，下面这些标志组合的执行速度是最快的：


    Watcom C++      -oneatx -zp4 -5r -fp3
    GNU C++         -O3 -fomit-frame-pointer
    Borland C++

如果你找到了更好的设置方法，请让我知道。



#### 循环展开的注释

打开编译器的“循环展开”选项可能会起作用，这个选择试图把短的循环展开成线性的代码，但根据我的经验，这个选项的效果并没有传说中的那么好，在一些特殊情况下反而会降低代码的性能。



优化 C 代码本身比设置选项要难一些，而且通常依赖于目标 CPU，下面几条规则适用于所有 CPU，但不要把它们视作绝对真理，因为你遇到的情况可能不同：


* **使用性能分析工具!** <br> 用一个好的性能分析工具（我首先想到的就是 GPROF）来分析你的程序可能会带来意想不到的效果，你可能会找到那些运行频率最高、降低了整个程序速度的代码，优化这些代码或者用汇编语言重写会大大提升程度的性能。
* **不要用 C++** <br> 不要使用 C++ 编译器支持而纯 C 编译器不支持的结构，因为 C++ 编译器生成的代码通常会有额外开销。
* **整数大小** <br> 使用 CPU 提供的基本整数类型，比如 int 而不是 short 或 long，因为这样不但能减少编译器生成代码（用来转换整型长度）的数量，而且能减少访存次数，因为如果数据的大小和 CPU 读/写存储器数据的大小一致，就可以一次完成读写。
* **寄存器分配** <br> 在每段代码中少用一些变量，并把使用频率最高的变量声明为寄存器变量（绝大多数新版编译器都会自动把变量放到寄存器中）。这对那些有很多通用寄存器（PowerPC）的 CPU 很有效，但对那些仅有少量寄存器的 CPU（Intel 80x86）就不一定了。
* **展开小循环** <br> 如果代码中有一个小循环执行了很多次，最好把它手动展开，见“自动循环展开”的注释。
* **移位代替乘除** <br> 当你需要乘或除 2 的 n 次方时使用移位操作（J/128==j>>7）。它们在绝大多数的 CPU 上都很快/另外，使用 AND 位操作来实现求模（J%128==J&0x7F）。



### 什么是字节序？

CPU 可以根据在存储器中保存数据的方式分类，除了一些特殊情况，绝大多数 CPU 可分为以下两类：


#### 大端序


大端序（High-endian）的 CPU 在存储器中保存数据时字（word）的低位字节会先出现。例如，如果你把 0x12345678 保存在大端序的 CPU 时，存储器看起来像这样：<br>

    0  1  2  3
    +--+--+--+--+
    |12|34|56|78|
    +--+--+--+--+
    
    
#### 小端序


小端序（Low-endian）的 CPU 在存储器中保存数据时字的高位字节会先出现。相同的例子在小端序 CPU 中会看起来大不相同：

     0  1  2  3
    +--+--+--+--+
    |78|56|34|12|
    +--+--+--+--+


大端序 CPU 典型的例子是 6809、Motorola 680x0 系列、PowerPC 和 Sun SPARC。小端 CPU 包括 6502 和它的后代 65816、Zilog Z80、绝大多数 Intel 芯片（包括 8080 和 80x86）、DEC Alpha 等等。


{% highlight c%}
typedef union
{
    short W;        /* 按字访问 */
    struct          /* 按访问... */
    {
#ifdef LOW_ENDIAN
        byte l,h;     /* ...在小端序结构中 */
#else
        byte h,l;     /* ...在大端序结构中 */
#endif
    } B;
} word;
{% endhighlight %}


正如你所见，你可以用 w 来访问整个字。尽管仿真器每次需要以独立的字节访问字，但你心里只要想 B.I 和 B.h 就行了。



如果你需要在不同的平台上编译程序，可能需要在仿真前测试一下它的字节序，然后设置相应的编译标志。以下方法可以完成测试：

{% highlight c%}
int *T;
T = (int *)"\01\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0";
if (*T == 1) printf("本机是大端序。\n");
else printf("本机是小端序。\n");
{% endhighlight %}


### 怎样提高程序的移植性？


待续。


### 为什么要模块化？


绝大多数计算机系统是由多块芯片组成的，它们各自完成了系统的部分功能。因此有 CPU、视频控制器、声音发生器，等等，有的芯片可能有自己的存储器和相连的硬件。


典型的仿真器应该在独立的模块中实现各个子系统的功能，从而还原系统的设计。首先，这样调试起来更简单，因为所有的错误都锁定在了一个模块中。其次，如果把体系结构模块化，就可以在其他仿真器中重用模块。计算机硬件的标准有规范：你完全可以在不同的计算机模型中找到相同的 CPU 或视频芯片，与其为每台计算机都实现一次芯片，不如只仿真一次，这样会轻松很多。
