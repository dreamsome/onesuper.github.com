---
layout: post
title: "Linux 汇编入门"
category: technium
tags: [linux,assembly]
---


Linux 是 Unix 的后代，而 Unix 的出身地是美国 AT&T 公司的贝尔实验室，所以当 Linux 被移植到 i386 平台时，也沿袭了 AT&T 的语法格式。在 Linux 下，我们可以用 GAS 这个编译器来编译 AT&T 格式的汇编代码。也可以用 Intel 格式来写，使用 NASM 这个编译器就行了。


NASM 的编译的命令为：


	nasm -f elf hello.asm


其中elf代表Linux目标文件格式，Windows的文件格式是PE。


然后进行链接即可：

	ld -s -o hello hello.o

既然都是 Intel 格式的汇编，都跑在 x86 体系结构的个人电脑上，那么 Linux 汇编和在 DOS 汇编到底有什么区别呢？


### 系统调用


我们知道学习汇编程序最重要的一件事就是要知道如何陷入操作系统内核，因为只有知道了操作系统提供给的可编程接口才能发挥操作系统全部的功能，无论是在 DOS 还是在 Linux 下，都使用系统调用的方式来陷入操作系统内核（DOS 中是 int 21h，而 Linux 是 int 80h），在这点上没有本质区别，只是进入时的口令不一样，所需要的参数不同罢了。但是一旦进入了操作系统内核，Linux 和 DOS 使用了完全不同的运行时库（run time library），虽然系统调用的结果可能相同（比如都实现了 read 的功能），但实现的方法绝对不同。


比如在处理 IO 时，DOS 又调用了 BIOS 提供的编程接口。标准输入输出系统（Basic Input Out system，俗称 BIOS）是 PC 发展到今天最古老的设备，因为没有它 PC 根本没有办法启动起来：它负责机器加电以后初始化硬件、检测硬件并引导操作系统这样重要的工作，并在机器运行时提供了一套和硬件设备打交道的驱动程序。DOS 在 BIOS 的基础上建立起了一套更加抽象的 IO 服务（比如程序员在写磁盘的时候不必清楚写哪个扇区，只要给出文件描述符就行了）。但是自从 Windows NT 和 Linux 出现以后，绝大部分和硬件交互的驱动都已经放到了操作系统中去完成，Linux 的输入和输出完全依靠那些用C语言编写的驱动程序而非 BIOS。


### 工作模式

Linux 工作在 32 位保护模式下，并且是 flat memory 内存模式，任意段都可以使用 32 位的线性地址，寻址空间是 4G，操作系统自动管理内存并且采用了分页机制，但这些对程序员来说是透明的。


而 DOS 则工作在 16 位实模式底下，所以必须在程序中手工进行装段，缺乏可靠的保护措施。相同的汇编代码，Linux 可能比 DOS 做了更多的工作，只是这一切我们看不到罢了。


### 程序结构

在汇编程序中两者的子程序在结构上还有一点区别。DOS 的子程序一般是这样的：

	A proc
		…
		…
		…
		ret
	A endp

以proc开头，以endp结尾。事实上程序总是执行到ret就返回了，所以ret后面endp永远不会被执行。相比之下，Linux汇编的子程序就要简洁得多，因为在内存中任何东西都只是标号（地址）而已：

	A：
		…
		…
		…
		ret

### write

Linux 系统调用和 DOS 系统调的过程差不了多少，比如我们要使用 write 这个系统调用：

1. 在Linux 系统调用表中找到 write 的系统调用号（4），然后把它送到 eax 中。
2. write 系统调用的完整格式是 ssize\_t write(int fd, const void *buf, size_t count)；因此还把要写的文件的文件句柄赋给 ebx，并把缓冲区的地址和长度分别赋给 ecx 和 edx。
3. 使用 int 80h 系统调用，呼叫系统内核，剩下的事情就交给操作系统了。

### 完整的程序

最后来看一个完整的 Linux 汇编程序，它的功能是向标准输出流输出"hello,world"

	SECTION .DATA
		hello:     db 'Hello world!',10
		helloLen:  equ $-hello
 
	 SECTION .TEXT
		 GLOBAL _START
 
	 _START:
		 ; 'Hello world!'
		 mov eax,4                 ; 'write' 系统调用
		 mov ebx,1                 ; 描述符1 = 屏幕
		 mov ecx,hello             ; 要写的字符串
		 mov edx,helloLen          ; 字符串长度
		 int 80h                   ; 呼叫内核
		 ; 退出
		 mov eax,1                 ; 'exit'系统调用
		 mov ebx,0                 ; 错误代码设为0
		 int 80h                   ; 呼叫内核
