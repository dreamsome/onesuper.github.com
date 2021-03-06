---
layout: post
title: "漫话内存管理"
category: technium 
tags: []
---


任何程序的运行都需要占用系统资源，资源包括很多方面，其中一种就是内存资源，我们知道“内存就像是厨房里的垃圾桶，无论多么大，永远是一种稀缺资源”，所以一个好的内存管理算法对操作系统来说十分重要。而所谓的内存管理就是用户程序向系统发出内存申请以后，操作系统根据某种策略为其分配内存空间的一个过程。

打一个比方，如果把“内存"看成一家银行，那么申请空间的“进程”就是前来银行贷款的人，内存资源就是我们的钱。内存和人民币除了都很紧俏以外还有一个很相似的地方：内存单元一般是以 2 的 k 次方为固定大小，而人民币的面值为1、2、5、10、20、50、100，也是2倍地在递增，除了 5 和 50，因为我们的手指有五根。

下面看看到以下这些银行在管理资金时都采取了什么策略。

### 穷人银行

穷人银行采取的策略是固定尺寸的分配（而下面几所银行在分配内存时则不固定内大小，也就是所谓的动态分配），即无论来银行贷款的人想贷多少，银行一律都借 10 元，即在分配内存时不考虑进程的实际需要分配一段固定大小的空间，这种算法的缺点是显而易见的，10 元并不能满足所有客户的需要，反映在计算机上就是一些大的程序无法运行，而且如果有人只想贷 1 元，那么剩下 9 元钱对银行来说就浪费了，这在内存管理中被称为内部碎片，与之对应的是外部碎片，它是指银行宁可把钱闲置，也绝对不多给用户一个子儿，现实中绝大多数商家和银行都采用这种思想。再回过头来看穷人银行，尽管它可能会因此失去那些大客户，但是对于穷人们而言，借款和还款的管理是十分方便的，假如今天银行准备了 100 元，那么很快就可以估计出总的总的容量就是 10，而且银行一旦收到还款转手就可以借给新的客户，十分方便。诺贝尔和平奖金得主尤尔斯曾开过一家“穷人银行”，当然和我说的这家没多大关系。

### 牛奶卡银行

这所银行用一张卡片来记录当天的交易情况，卡片上的每个格子都代表了 10 元人民币（一共 200），和我小时候用过的牛奶卡很像：

![1](http://ww1.sinaimg.cn/mw600/534218ffgw1dtgdkor1x7j.jpg)

A 欲贷款 40 元，银行的工作人员划掉 4 个格子，然后从金库里取 40 元给他，“牛奶卡”变成下面这个样子：

![2](http://ww2.sinaimg.cn/mw600/534218ffgw1dtgdklc7ymj.jpg)

B 贷款 20 元，再划 2 个格子：

![3](http://ww2.sinaimg.cn/mw600/534218ffgw1dtgdkpdw6tj.jpg)

C 又贷款 100 元，划 10 个格子：

![4](http://ww1.sinaimg.cn/mw600/534218ffgw1dtgdknhrozj.jpg)

B 这个时候来还款，金库此时多了 20 元：

![5](http://ww2.sinaimg.cn/mw600/534218ffgw1dtgdkm9zw8j.jpg)

这时如果 D 要借 50 元，工作人员一看卡上找不到连续的 5 个格子了，于是告诉 D：“没有 50 元了，只剩下 20 元或 40 元，您要哪种？”——这里的 20 和 40 就是所谓的外部碎片，导致它的罪魁祸首便是内存的连续分配，或者说银行工作人员的“一根筋”，下面的两家银行用离散分配的方法成功地解决了外部碎片的问题。

### 零钱银行

这家银行把每天准备 20 张 5 块钱零钱进行交易，如果客户想要贷款 22 元，就给他 25 元,其中 3 元作为内部碎片被浪费掉，如果进一步缩小交易的最小面额，比如使用 2 元，那么可以减少这种浪费，但同时加大了后期化零为整的难度。这种离散分配的方式就是现代操作系统普遍采用的分页管理机制，因为程序的逻辑地址仍旧需要连续，因此在转换成物理地址时需要进行地址映射，换句话说客户不希望拿到手的是零钱，于是银行需要雇个小工（内存管理单元）去隔壁的超市换钱（内存映射）。虽然“零钱”提高了资金的利用率，但是它并不适合那些 VIP 客户，比如操作系统的内核程序，如果程序分布在离散的页面上，那么程序在运行过程中就要多次查询页表，增加访存时间。

### 普通银行

最后来看一所最普通的银行所采取的策略，那就是把 1 元 2 元 5 元……所有这些面额的钱都准备个几份，如果有零钱就给零钱，小面额的钱用完了就想办法把大面额的钱找开来，至于怎么找？就是对分，100 换成两张 50，20 换成两张 10，反过来在回收内存时尽可能地化零为整。这就是 Buddy 算法的思想，它同样可以提高内存的利用率，并且是一种相对连续的分配方式，Linux 用它为内核分配连续的页框。
