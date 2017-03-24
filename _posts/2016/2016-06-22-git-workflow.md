---
layout: post
title: "Git工作流"
category: technium
tags: [git]
---

在 git 中，任何形式的修改都以 commit 的形式体现，因此对于「修改」的修改需要使用更高级的语法。

具体来讲，在 git 中当你需要修改某个 commit 时，需要进行以下操作：

- 输入 `git rebase --interactive [hash]^`
- 选中你想要修改的那个 commit，把 pick 改成 edit
- 重新提交
- 退出 rebase 状态
- 强制更新分支

这种设计背后的思想是：一个功能上的修改，在实现时往往可以分划分为更多更小的修改。

对于 [Git 工作流](https://github.com/TryGhost/Ghost/wiki/Git-workflow) 来讲 ，一次 commit 显然就是「实现上的修改」，「功能上的修改」则以 Pull Request 的形式呈现。而在 [Gerrit 中](https://code.google.com/p/gerrit/)，commit 被定义为了「功能上的修改」，每次改动最终只有一个 commit，不同 patch 之间的 diff 记录在了 issue track 系统中。

Git 工作流鼓励程序员把一次「功能上的修改」划分为多个 「实现上的修改」，并为每个修改都命名，而对于「修改」的修改，需要用 edit、fixup、squash 等命令来操纵，导致 rebase 这个命令十分复杂。而 Gerrit 鼓励的工作模式更符合大部分程序员的工作方式，即专注于「功能」上的改动。