---
layout: post
title: "开源软件的自由与限制"
category: technium
---







## 开源的市场规律



说起开源人们总是想到：安全、协作、低成本、积极发展和自由这些正能量的词汇，甚至有人把开源形容为一种[精神](https://hackernoon.com/why-we-need-open-source-spirit-g2573yzv)，而开源的反面闭源总是和限制、封闭、不思进取、厂商锁定联系在一起。当云厂商与开源供应商出现利益冲突时，很多人也站在了「正义」的一边，指责云厂商不劳而获。

我认为支撑起开源发展的既不是情怀，也不是对自由的宗教式信仰，而是开源背后的市场规律。一方面是需求的崛起，信息化建设依赖大量科技公司，而开源软件满足了这些科技公司发展的需要。和音乐一样，软件天然是数字化的商品，分发成本为零，于是市场上出现了 Github 这样聚集需求的平台方，Github 提高了开源项目发现的效率，每当程序员在开发一个新功能前，都会在 Github 上先搜索有没有开源项目能够满足需要。

另一方面，作为回报 Github 也让写出有用程序的程序员得到了大量的关注 ，虽然他们可能无法获得直接的经济回报，但对他们的职业发展有很大帮助。开源不是一种纯粹的利他行为的另一个证明是，出现了很多基于开源项目的商业公司，长期以来 Hadoop 生态的最大贡献者是 Cloudera 和 Hortonworks 这两家商业公司。

Maxime Beauchemin 曾经在 Airbnb 工作期间创造了 Airflow 和 Superset，本文中他提出了使用开源 BI 的三个优势：方便扩展、借助社区的力量以及避免被厂商锁定。[他提到](https://preset.io/blog/future-of-business-intelligence/)，开源之所以能够「接管」 modern data stack 的各种工作场景，很重要一点是开源软件更容易被发现和测试，软件分发的主要成本来自于怎么让用户知道你（搜寻成本），和怎么教育用户学会使用它（交易成本）。



> Simply put, open source is a superior approach at building and distributing software because it provides important guaranties around how software can be discovered, tried, operated, collaborated on and packaged. For those reasons, it is not surprising that it has taken over most of the modern data stack: infrastructure, databases, orchestration, data processing, AI/ML and beyond.



### 平台降低了搜寻成本



Alex Danco 在自己的 [newsletter](https://alexdanco.com/2020/10/08/making-is-show-business-now/) 中推荐了 Nadia Eghbal 的 [Working in Public: The Making and Maintenance of Open Source Software](https://www.amazon.com/Working-Public-Making-Maintenance-Software/dp/0578675862)，这本书阐述了开源工作方式发生的变化。



> 90 年代和今天之间发生了一些重要的变化。如果你看一下现在大多数开源项目，做事的人和旁观者的分布是明显倾斜的：常见情况是，项目中 95% 的工作是由一个核心的人完成的，甚至可能只有一个开发者，而长尾的「贡献者」实际上更像是用户或消费者：他们有时 Pull Request，有时标记一些 Issue，但他们更像是观看足球比赛的球迷，而不是主要的参与者。
>
> 

由于 Github 这样的平台出现，软件创建、发布和发现变得更加容易，开源不再是人与人之间平等的协作性（collaborative）社区，而成为了**创造者的一场 Show**，在这场 Show 中，创造者除了维护代码本身，还需要维护人们的注意力。由于任何人加入项目都没有门槛，热门的项目会被小白用户占领，甚至[创造者不得不面对参与者的众口难调，有时还会受到恶毒的言语攻击](https://avocadotoast.live/episodes/70/?t=3332)。这似乎又印证了人月神话中 Fred Brooks 的观点：「在一个任务中增加边缘工程师会产生更多的成本，而非收益。」



Danco 说：

> Communities are for collaborators; Platforms are for creators





### 开源降低了交易成本



**我们塑造了我们的工具，工具反过来又塑造了我们。**Github 这样的开源平台加速了软件的发现，也意味着任何人都有可能在没有背景的情况下看到你的 Show，人们更倾向于开发更模块化和即插即用的开源软件，因为一个关注面更小的工具不仅受众更大，所需要的信任成本也更低。相同的逻辑同样出现在视频媒体的生产端。



开源协议通过取消**限制**，降低了软件的**交易成本**，这里的成本不仅仅指软件许可证的售价高昂，还有**信任成本**，传统软件的销售周期漫长，因为需要花费大量时间教育客户和培养信任感，客户为了防止买错，也会花很多时间验证软件与自己需求的匹配度，这也是为什么很多 ToB 公司喜欢开各种大会来提高客户的认知度。



大名鼎鼎的 Richard Stallman 曾在[《为什么软件应该免费》](https://www.gnu.org/philosophy/shouldbefree.en.html)中写道：



> 一个程序对社会的总贡献会因为给它指定了一个所有者而减少。该程序的每个潜在用户，面对使用该程序需要付费的情况，可以选择付费，也可以放弃使用。当用户选择付费时，这是在双方之间进行的零和财富转移。但每次有人选择放弃使用时，这就会伤害到这个人，而不会使任何人受益。负数和零的总和必然是负数。但这并没有减少开发程序所需的工作量。因此，整个过程的效率，即每小时工作所交付的用户满意度，就会降低。



这段话完美地诠释了开源的单位经济效益。



## 自由的代价



赚钱诚可贵，道德价更高，若为自由故，二者皆可抛。



开源货币化难题和开源的道德困境背后其实是一个问题——自由与限制天然是矛盾的。任何的限制行为无论是增加协议来防止云厂商吸血，还是增加条款来防止他人用软件来做作恶，都会提高**交易成本**，让开源软件被更少的人使用。



### 货币化难题



Databricks 的 CEO Ali Ghodsi 认为对于云厂商「吸血」开源项目的指责[是一种红鲱鱼](https://www.computerweekly.com/blog/Open-Source-Insider/Databricks-CEO-Managing-open-source-in-the-cloud-is-hard)：

> We believe this value lies in the vendor’s ability to deliver open source software as a service. The cloud is an inevitability these vendors will need to embrace and prove their performance at scale to cope with the increase in demand for edge computing. Instead of wasting time on pushing cloud providers away, they should be focused on building great SaaS offerings.

> Limiting the license of their software will just lead to less adoption and community-driven innovation around those open source projects, which poses a far bigger existential threat to their business.



之所以云厂商可以轻松夺走开源项目辛苦播种多年的果实，是因为开源软件没有内在的货币化价值，因此开源供应商不得不把 SaaS 模式作为主要变现方式。

这让我想到了 Ben Thompson 的[经济现实决定论](https://stratechery.com/2019/aws-mongodb-and-the-economic-realities-of-open-source/)：世界是由经济现实支配的，而不是由主观的公平判断决定的，随着软件的部署方式从 on-premise 向 SaaS 转移，开源供应商势必在云厂商的强项——**可伸缩性、可用性、性能**面前黯然失色，与其花费时间提供和云厂商一样的能力（况且还没那么容易），不如探索这以外的新价值。



### 道德问题



最近国际开源界对于道德和平权的争论[方兴未艾](https://jhuo.ca/post/rms_return_fsf/)，数据科学从业者 Christopher Moran 把机器学习正面临的道德危机归咎于[开源许可证的过分自由](https://thegradient.pub/machine-learning-ethics-and-open-source-licensing/)。



首先 Moran 列举了一连串社会事件，证明市场机制、道德约束和政府监管在防止人们不道德地使用机器学习上存在各自的缺陷，而作为开发者或研究人员，也缺乏手段来**限制自己的工作对其他人造成伤害**。问题出在开源（自由）软件的定义上：



> 这些标准由自由软件定义（FSD）和开源软件定义（OSD）。虽然两者之间有一些重要差异，但最终都要求一个通常被称为 Freedom Zero 的概念，或 「为任何目的，随心所欲运行程序的自由」"（OSD将其表述为「不得歧视领域」）。



类似于自动驾驶的分级，Freedom Zero 就是四个自由度中级别最低的自由度。也就是说开发者无法要求一个组织不可以将 Tensorflow 用于监视他人，诚然，自由让开源在 90 年代得到了空前的发展，它不仅让个体可以控制软件的运行环境，并且让合作变得容易，这是软件许可证和其他知识产权最根本的不同，开源（自由）软件鼓励被修改和二次创造。



试想一下，如果每个开源贡献者都试图在项目中增加自己的限制，那么项目会变得难以管理，尤其对 Linux 或 PyTorch 这样的大型项目来说。但今天很多的项目（比如 FastAI），它们往往依靠几个贡献者就完成了大部分工作，正如 Alex Danco 所说，「Communities are for collaborators; Platforms are for creators」。



其次，机器学习和传统开源项目也有很大区别，在机器学习中，系统的核心不是源代码，而是训练出来的模型，模型的版权不应该继承自训练它的代码，一个类比是用开源画图软件画出来的艺术画的版权不应该继承画画软件的许可证。



## 自由反面不是不自由



有时候开源并没有我们想象的那么美好，我们对开源的固有印象很多都是营销的结果，[本文](https://www.snowflake.com/blog/choosing-open-wisely/)分享了 Snowflake 对于开源的态度，作者之一是 Snowflake 的创始人和产品负责人 Benoit Dageville。

本文认为束缚组织数据的罪魁祸首，并不是封闭的文件格式，而是用户的应用程序代码和业务逻辑，以及停机维护带来的经济损失，开放文件格式只不过是一种掩人耳目的说法。

开放文件格式相当于将物理存储的细节暴露给用户，它不仅带来了应用开发的复杂性，同时还让创新的速度变慢，并带来一系列安全、治理和一致性的问题，反面教材分别是 ISAM(IBM 的文件系统)，CODASYL(Cobol 数据模型) 和 Hadoop：

> The history of database systems has plenty of examples like ISAMs or CODASYL showing us that physical access to data leads to an innovation dead end. More recently, adopters of Hadoop found themselves managing costly, complex, and unsecured environments that didn’t deliver the promised performance benefits. In a world with direct file access, introducing new capabilities translates into delays in realizing the benefits of those capabilities, complexity for application developers and, potentially, governance breaches. This is another point arguing for abstracting away the internal representation of data to enable more value to our customers, while supporting ingestion and export of open file formats.

只要提供开放的协议和 API，用户就可以导出它们，一样可以避免厂商锁定。事实上，开放不一定是创新和成本效益的同义词，开放只是人们追求创新、安全、性能、成本和简单过程中使用的手段，而不是目标，Snowflake 的目标是为客户提供价值。



文章还挑战了开源常见的「卖点」：

- **控制更强**：源代码的开箱即用，但并不代表你很轻易地了解其内部原理，一个例子是数据平台的查询引擎。
- **更安全**：复杂的解决方案往往需要拼接多个软件子系统，几乎不可能端到端地了解系统对安全的影响。
- **成本更低**：开源软件虽然免费，但是管理版本和参数调优伴随着高昂的人力成本，而这也是开源厂商使用的货币化策略——提供托管服务。
- **社区的力量**：合作不一定意味着非得贡献源代码，不开源社区成员也能够互帮互助、分享最佳实践、探讨技术方向。







