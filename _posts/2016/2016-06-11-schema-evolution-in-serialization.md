---
layout: post
title: "序列化Schema演化"
category: technium
tags: [notes, Avro, Protocal Buffers]
---

在计算机科学中，序列化通常是指把程序中的数据转化为某种可以存储、可以传输的形态。序列化一个程序对象有时也被称作 marshal（列队集合）。

关于序列化一个重要的问题是：如果定义数据的格式发生了变化怎么办？现实世界中的数据总是在不断变化，[Schema evolution in Avro, Protocol Buffers and Thrift 这篇文章](http://martin.kleppmann.com/2012/12/05/schema-evolution-in-avro-protocol-buffers-thrift.html)讨论了目前几种流行的序列化方案是如何在设计上保持可扩展性的，这里做下记录。

### 序列化的四个阶段

1. 使用某种语言的库对程序员中的对象进行序列化，例如 marshal、pickle。
2. 认为这事应该与语言无关，开始用一些文本格式，例如 JSON。
3. JSON 解析起来又慢又罗嗦，于是发明了某种二进制格式的  JSON。
4. 人们开始在对象中添加自己的类型，最终演化为了 schema 和 document 两个部分。静态类型语言的用户为了图方便，用 codegen 的技术甚至根据 schema 自动生成出对应的 reader 和 writer 的逻辑。

而 Thrift、Protocol Buffers 或 Avro 就是这条路走下来的终极解决方案。Thrift、Protocol Buffers 和 Avro 都支持 schema 的演化。

### Protocal Buffers

Protocol Buffer 序列化后的每一个字段都以 一个 byte 开头，这个 byte 表示 tag 和字段的类型。

- 如果字段是字符串，紧接着存放的是字符串长度，以及 UTF-8 编码的字符串。
- 如果字段是整型，紧接着存放的是一个边长编码的数。
- 有数组类型，但是同一个 tag 的数据可以重复出现，类似一个数组。

当 schema 变化以后：

1. optional、required 和 repeated 字段的编码方式没有区别，repeated 字段只是重复出现在数据中而已，因此这个属性可以随时改，而不用把整个数据类型作废掉。Parser 只是在运行阶段报错或丢弃字段。
2. 任何时候你都可以将某个不想要的 tag 废弃掉，只要你不再使用那些废弃的 tag 。
3. 任何时候你都可以添加一个新的字段，只要给它一个新的 tag。老的 Parser 虽然不认识这个 tag，但是只要可以知道它的类型就可以跳过它，找到下一个它认识的 tag（向前兼容）。
4. 可以随意地改名字，因为数据本身不包含名字（灵活性）。

### Avro

Avro 的 schema 既可以用 JSON 也可以用 IDL 来写。字符串在 Avro 中仍旧是「长度加 UTF-8 编码的字符串的形式」，只是编码中并不保存类型信息，所以无法区分它和其他字节流的区别。识别数据类型的唯一方法是在 Parse 阶段读取 schema，而且读取这段数据的 reader 必须要与和编码这段数据的 writer 有相同的版本的 schema 才行，否则读的时候会出错。

1. Avro 编码中没有字段分隔符的概念，每个字段只是挨个存放（根据schema 定义的先后顺序），也就是说，optional 字段必须用 union {null, long} 来代替，所以额外消耗一个字节。
2. 由于 union 能够出现的类型写死在 schema 里，reader 必须时刻保持最新的 schema ，否则 writer 写的新数据 reader 没法读取。
3. reader 和 writer 是按 schema 中字段的名字顺序读取字段 。
4. 按名匹配的一个坏处是，改名字很麻烦，因为必须把所有的 reader 的 schema 都改掉。
5. 必须有默认值。新的 reader 读老的数据看到不认识的名字，就使用默认值。

如果说 Protocol Buffer 记录中的每个字段都打标记，Avro 中是对一整条记录或者一整个文件打上一个标记。

什么时候用 Avro？

* 在大数据的场景中，通常是几千条数据共享相同的schema，所以只要一开始 parse 一次 schema 后面的 记录可以复用。
* 而在 RPC 中，需要每个请求中都传送一次 schema，除非 RPC framework 使用长连接。
* 为每个 record 存储一次 schema 开销太大，可以按 version 进行 hash，搞成一个 registry 中心。

当然额外的 schema 的分发即是缺点也是优点：

- Avro object container files 本身可以当成配置文件。
- 以 JSON 为载体的 schema 可以加入一些 meta 信息，分发时可以携带这些原信息。
- 中央管理的 registry 中心不但可以重用数据，而且可以保证数据是最新的。

### Thrift

Thrift 不仅是一个序列化库，而是一整个 RPC 框架。Thrift 中包含进了多种序列化格式（协议）。Thrift 的二进制和 Protocol Buffers 类似，通过 tag 来控制不同版本的演化。不同的是，Thrift 中用 list 类型来表示重复类型的数据（Protocol Buffers 的 repeated）。
