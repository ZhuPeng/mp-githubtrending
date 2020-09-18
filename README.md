[![HitCount](http://hits.dwyl.io/ZhuPeng/mp-githubtrending.svg)](http://hits.dwyl.io/ZhuPeng/mp-githubtrending)

# 微信小程序 GitHub Trending Hub

小程序 `GitHub Trending Hub` 是一个以 Feed 流形式查看 GitHub Trending 仓库集合的工具，通过它可以及时查看最近更新的热门仓库。通过微信 WeChat 扫码体验。

> 注意：原来的 `GitHub Trending Hub` 由于不可抗力被微信永久封禁了。基于当前代码改造了以下 `开源 Books` 小程序，可以方便的查看开源的书籍和文档，欢迎大家体验。

![qrcode](https://7465-test-3c9b5e-1258459492.tcb.qcloud.la/qrcode.jpg)

扫码关注如下微信公众号，定期获取 GitHub Trending 更新推送

![wechat](https://7465-test-3c9b5e-1258459492.tcb.qcloud.la/common/ultrabot-qrcode.png)



## 文档

* [微信小程序 GitHub Trending Hub 的由来](doc/why.md)
* [使用文档](doc/help.md)
* [公众号文章链接 GitHub 仓库指南](doc/api.md)
* [适合手机查看的优秀仓库合集](doc/excellent_repo_for_mobile_reading.md)



## 说明
小程序中首页的数据通过 [trackupdates](https://github.com/ZhuPeng/trackupdates) 抓取 GitHub Trending 页面获得，展示最近一个月出现在 Trending 上的仓库（只在第一次出现仓库时展示，意思昨天出现了今天就不会在首页的 Feed 流里面了），并通过如下代码 [sync2db.js](sync2db.js) 同步到小程序云开发数据库，提升访问速度和体验。除此之外还整合了 GitHub 的仓库统计信息和 [GitHub Resume](https://github.com/resume/resume.github.com) 等功能。 
整个小程序的后端是使用微信的云开发方式，无服务化极大的简化了小程序的运维。


## Stargazers over time

[![Stargazers over time](https://starcharts.herokuapp.com/ZhuPeng/mp-githubtrending.svg)](https://starcharts.herokuapp.com/ZhuPeng/mp-githubtrending)

## 依赖的开源项目

* [octokit/rest.js](https://github.com/octokit/rest.js): GitHub REST API client for JavaScript
* [ZhuPeng/trackupdates](https://github.com/ZhuPeng/trackupdates): A simple yaml-based xpath crawler
* [TooBug/wemark](https://github.com/TooBug/wemark): 小程序中的 Markdown 渲染仓库
* [youzan/vant-weapp](https://github.com/youzan/vant-weapp): 轻量、可靠的小程序 UI 组件库
* [wux-weapp/wux-weapp](https://github.com/wux-weapp/wux-weapp): 一套组件化、可复用、易扩展的微信小程序 UI 组件库
* [dankogai/js-base64](https://github.com/dankogai/js-base64/): base64 编解码库
* [weui/weui-wxss](https://github.com/weui/weui-wxss): 微信官方的 UI 库
* [resume/resume.github.com](https://github.com/resume/resume.github.com): 自动生成 GitHub 简历
* [2016rshah/githubchart-api](https://github.com/2016rshah/githubchart-api): Embed github contributions chart as image

## 赞赏是一种力量

| 微信 | 支付宝 |
| :---: | :----: |
| ![](https://7465-test-3c9b5e-1258459492.tcb.qcloud.la/common/Wechat-zanshang.jpeg) | ![](https://7465-test-3c9b5e-1258459492.tcb.qcloud.la/common/alipay-qrcode.jpeg) |


有任何问题，欢迎提交 [Issue](https://github.com/ZhuPeng/mp-githubtrending/issues/new) 或者 PullRequest。同时有任何的技术问题欢迎大家添加作者微信交流。

![](https://7465-test-3c9b5e-1258459492.tcb.qcloud.la/mp-githubtrending/wechat_xiaopeng.jpeg)

## Contributors

### Code Contributors

This project exists thanks to all the people who contribute. [[Contribute](CONTRIBUTING.md)].
<a href="https://github.com/ZhuPeng/mp-githubtrending/graphs/contributors"><img src="https://opencollective.com/mp-githubtrending/contributors.svg?width=890&button=false" /></a>

### Financial Contributors

Become a financial contributor and help us sustain our community. [[Contribute](https://opencollective.com/mp-githubtrending/contribute)]

#### Individuals

<a href="https://opencollective.com/mp-githubtrending"><img src="https://opencollective.com/mp-githubtrending/individuals.svg?width=890"></a>

#### Organizations

Support this project with your organization. Your logo will show up here with a link to your website. [[Contribute](https://opencollective.com/mp-githubtrending/contribute)]

<a href="https://opencollective.com/mp-githubtrending/organization/0/website"><img src="https://opencollective.com/mp-githubtrending/organization/0/avatar.svg"></a>
<a href="https://opencollective.com/mp-githubtrending/organization/1/website"><img src="https://opencollective.com/mp-githubtrending/organization/1/avatar.svg"></a>
<a href="https://opencollective.com/mp-githubtrending/organization/2/website"><img src="https://opencollective.com/mp-githubtrending/organization/2/avatar.svg"></a>
<a href="https://opencollective.com/mp-githubtrending/organization/3/website"><img src="https://opencollective.com/mp-githubtrending/organization/3/avatar.svg"></a>
<a href="https://opencollective.com/mp-githubtrending/organization/4/website"><img src="https://opencollective.com/mp-githubtrending/organization/4/avatar.svg"></a>
<a href="https://opencollective.com/mp-githubtrending/organization/5/website"><img src="https://opencollective.com/mp-githubtrending/organization/5/avatar.svg"></a>
<a href="https://opencollective.com/mp-githubtrending/organization/6/website"><img src="https://opencollective.com/mp-githubtrending/organization/6/avatar.svg"></a>
<a href="https://opencollective.com/mp-githubtrending/organization/7/website"><img src="https://opencollective.com/mp-githubtrending/organization/7/avatar.svg"></a>
<a href="https://opencollective.com/mp-githubtrending/organization/8/website"><img src="https://opencollective.com/mp-githubtrending/organization/8/avatar.svg"></a>
<a href="https://opencollective.com/mp-githubtrending/organization/9/website"><img src="https://opencollective.com/mp-githubtrending/organization/9/avatar.svg"></a>
