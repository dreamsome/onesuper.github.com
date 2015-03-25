---
layout: post
title: "SimpleScalar源代码分析(1)：ISA"
---


（两年前的笔记，如果有空还是想完成这个系列的。）



SimpleScalar 定义 ISA 和进行译码的过程十分有趣。


译码部分的代码主要集中在 ss.h、ss.c 和 ss.def 三个文件中：（ss 是 SimpleScalar 的缩写，代码里会经常看到，下文出现 ss 的地方都可以换成 SimpleScalar）


首先在 ss 中，每一条“新鲜出炉”的指令就是一个结构体，它有两个 32 位字段的组成，加起来一共 64 位。

    typedef unsigned int SS_ADDR_TYPE;
    typedef struct {
    unsigned int a;
    unsigned int b;
    } SS_INST_TYPE;


一般 MIPS 指令的 48-64 位是 opcode。于是我们可以用 `inst.a & 0xff` 取得 opcode。同理我们可以用 `inst.b >> 8 & 0xff` 取得 RD（目标寄存器）。这些在 ss 中全是通过 Macro 完成的：


    /* returns the opcode field value of SimpleScalar instruction INST */
    #define SS_OPCODE(INST) (INST.a & 0xff)

    #define RS (inst.b >> 24) /* reg source #1 */
    #define RT ((inst.b >> 16) & 0xff) /* reg source #2 */
    ....

而译码(decode)的过程其实就是将一条“新鲜出炉”的指令的 opcode 映射某条对应的“动作（语义）”上。而定义这种映射关系的就是 ISA。


ss 用了一张表格来保存所有的指令的名字，其实就是一个 enum 类型：


    enum ss_opcode {
    ...
    #define DEFINST(OP,MSK,NAME,OPFORM,RES,FLAGS,O1,O2,I1,I2,I3,EXPR) OP,
    ...
    #include "ss.def"
    #undef DEFINST
    ...

    };

 

关键部分是 `#include "ss.def"`，打开它，发现是一些：


    DEFINST(ADD, 0x40,
    "add", "d,s,t",
    IntALU, F_ICOMP,
    DGPR(RD), DNA, DGPR(RS), DGPR(RT), DNA,
    (OVER(GPR(RS),GPR(RT)), SET_GPR(RD, GPR(RS) + GPR(RT))))


`ss.def` 给出了虚拟机器 ISA 的完整定义，而 `ss_opcode` 则把所有 ISA 的操作码的名字“扣“了出来，然后形成一个枚举类型，这个黑魔法依旧是是通过 Macro 完成的。


也就是说经过预处理，`ss_opcode` 就变成了下面这个样子：


  enum ss_opcode {
  ADD,
  SUB,
  JMP,
  ....
  }


从此以后我们就可以用以下代码完成 opcode 到指令名的映射（即在一个 enum 数组中进行索引，例如 `ss_mask2op[0x1]` 的结果就是`JMP`），前提是在 `ss.def` 中定义指令必须按照 opcode 排序。

 

    #define SS_OP_ENUM(MSK) (ss_mask2op[MSK])
    extern enum ss_opcode ss_mask2op[];

 

然后就是整个译码部分最销魂的一个部分，从“指令名”到“动作”的映射过程：


    while (TRUE)
    {
    ....
    switch (SS_OPCODE(inst)) {
    #define DEFINST(OP,MSK,NAME,OPFORM,RES,FLAGS,O1,O2,I1,I2,I3,EXPR) \
    case OP: \
    EXPR; \
    break;
    ...
    #include "ss.def"
    #undef DEFINST
    ....
    }

    /* execute next instruction */
    local_regs_PC = local_next_PC;
    local_next_PC += SS_INST_SIZE;
    }

 

Doug Burger 再次使用黑魔法把一个冗长的 switch case 语句缩成了七八行的样子。


在这里他把 `ss.def` 当成了一个配置文件，每次提取其中的关键信息，然后利用这些关键信息、使用预处理器生成出他想要的代码。也就是说上面这段代码其实是：


    while (TRUE)
    {
    ....
    switch (SS_OPCODE(inst)) {

    case ADD:
    /* 完成“加法”动作*/
    break;
    case JMP:
    /* 完成“跳转”动作*/
    break;
    case SUB:
    /* 完成“减法”动作*/
    break;
    ...
    }

    /* execute next instruction */
    local_regs_PC = local_next_PC;
    local_next_PC += SS_INST_SIZE;
    }



而“加法”的 ISA 语义动作就是定义在 `ss.def` 中的 `SET_GPR(RD, GPR(RS) + GPR(RT)`，他做的事情就是把 RS 寄存器中的值与 RT 寄存器的值加一加，放到 RD 寄存器中（又是宏！）。



**点评**：译码部分 Doug Burger 处理得比较花哨的，用了很多黑魔法，这样的优点是保持代码的短小精悍，而且在修改 ISA 时只要修改一个地方（`ss.def`）就可以了，保证了代码的可扩展性。缺点是由于每一次我们用 Macro 来取代函数，导致不能静态地检查错误（函数调用时，如果实参类型和函数签名不匹配，编译器会报错），可读性也不是很高。
