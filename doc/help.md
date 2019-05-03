关于为什么要开发这个小程序以及核心的思想可以查看文档：[微信小程序 GitHub Trending Hub 的由来](https://github.com/ZhuPeng/mp-githubtrending/blob/master/doc/why.md)。本文档主要介绍小程序的相关使用和设置文档，主要有如下三个方面介绍：

* GitHub 基础功能
* 博客和新闻订阅和推送
* 链接和分享



## GitHub 基础功能

首页中的 GitHub 项目会根据其出现在 Trending 的时间点更新，所以只要你持续关注小程序，就能及时和不遗漏的查看到你关心语言的 Trending 项目，同时支持选择过滤多个编程语言。基础的 GitHub 功能如搜索、查看项目详情、Commits、Issues、Pull Requests 等就不介绍了。主要介绍如下几个功能：

* 设置个人主页及 Token

  点击右下角的加号，再点击设置的图标

![](https://7465-test-3c9b5e-1258459492.tcb.qcloud.la/mp-githubtrending/doc/click-settings.png)

如果你之前未设置的话会出现如下图(设置了点击头像位置也会跳转到设置页面)，点击未设置就会跳转到设置页面

![](https://7465-test-3c9b5e-1258459492.tcb.qcloud.la/mp-githubtrending/doc/personal-account.png)

![](https://7465-test-3c9b5e-1258459492.tcb.qcloud.la/mp-githubtrending/doc/personal-settings.png)

Name 是登陆 GitHub 后的账户名，Token 可以访问 [https://github.com/settings/tokens](https://github.com/settings/tokens) 生成并复制填入即可，如果需要使用功能如评论 Issue、新建 Issue 等，请至少勾选如下权限（Token 只存储在本地，如有疑虑可以查看小程序的源码）：

![](https://7465-test-3c9b5e-1258459492.tcb.qcloud.la/mp-githubtrending/doc/token-scopes.png)

设置完成后返回即可查看到个人主页的信息了，其中 Repos 是个人的公开仓库列表，Events 是与你有关的 Issue 和 Pull Requests 列表，History 是你浏览的 GitHub 项目历史列表。

![](https://7465-test-3c9b5e-1258459492.tcb.qcloud.la/mp-githubtrending/doc/personal-account-with-settings.png)



* 仓库统计信息

为了方便的查看一个仓库的基础统计信息，我们为每个仓库生成了如下信息，包括 Stargazers over time、仓库 Summary 和 仓库的 Commit Authors 分布。

![](https://7465-test-3c9b5e-1258459492.tcb.qcloud.la/mp-githubtrending/doc/repo-stats.png)



* 个人简历

当我第一次看到项目 [https://github.com/resume/resume.github.com](https://github.com/resume/resume.github.com) 的时候，我是有点惊喜的，它能够基于我在 GitHub 的事件生成一份简历，我能在简历清晰的看到自己什么时候开始使用 GitHub、自己的成长和参与贡献的开源项目，所以当我开发小程序的时候是第一时间确定要开发支持的。如果你在 GitHub 有不错的贡献，直接给 HR 扔一份这样的简历是不是有点酷炫。在个人账户页有 Resume 链接提示，点击即可查看，同时也可以查看其它人的简历。

![](https://7465-test-3c9b5e-1258459492.tcb.qcloud.la/mp-githubtrending/doc/personal-account-resume.png)



![](https://7465-test-3c9b5e-1258459492.tcb.qcloud.la/mp-githubtrending/doc/zhupeng-resume.png)



## 博客和新闻推送和订阅

目前收录了 Hacker News、GitHub Blog、CoreOS Blog，通过小程序可以及时的查看到更新，同时我们维护了一个优秀的 GitHub 推荐系列，每天推荐一个优秀的仓库在首页的轮播图展示。

![](https://7465-test-3c9b5e-1258459492.tcb.qcloud.la/mp-githubtrending/doc/blognews.jpeg)

每篇推荐文章的页面最底部有点赞和订阅的功能，订阅之后会在更新的时候通过微信的服务通知推送(目前的推送频率是早上 8~9 点左右，每周大概两次)。按照目前微信的推送策略，只有点击了小程序里面的 Button 才会获取到一次被推送的机会，所以如果你不希望错过推送的话，可以在每次看完之后点一下 Like +1，当然如果你不想被推送的话，不使用小程序即可，大家可以放心不会受到骚扰。

![](https://7465-test-3c9b5e-1258459492.tcb.qcloud.la/mp-githubtrending/doc/subscribe.png)

![](https://7465-test-3c9b5e-1258459492.tcb.qcloud.la/mp-githubtrending/doc/push.jpeg)



## 链接和分享

通过微信公众号文章链接跳转到小程序可以查看文档：[公众号文章链接 GitHub 仓库指南](https://github.com/ZhuPeng/mp-githubtrending/blob/master/doc/api.md)。另外在使用小程序过程中，任何页面都可以点击下图中的两个地方转发和生成二维码分享给你的小伙伴。

![](https://7465-test-3c9b5e-1258459492.tcb.qcloud.la/mp-githubtrending/doc/report.jpeg)



![](https://7465-test-3c9b5e-1258459492.tcb.qcloud.la/mp-githubtrending/doc/genqrcode.jpeg)





## 如果你期望一些新的功能，或者有任何问题，欢迎给我们提交 [Issue](https://github.com/ZhuPeng/mp-githubtrending/issues/new) 或者 PullRequest。