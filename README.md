# 微信小程序 GitHub Trending Hub

GitHub Trending 仓库集合，以 Feed 流形式展现，能够及时查看最近更新的热门仓库，同时提供搜索、查看仓库详情等功能。欢迎通过微信 WeChat 扫码体验。

![qrcode](https://7465-test-3c9b5e-1258459492.tcb.qcloud.la/qrcode.jpg?sign=d350a14b8d342714aa7c7246cd6a41fa&t=1548588526)



## 文档

* [公众号文章链接 GitHub 仓库指南](doc/api.md)
* [使用文档](doc/help.md)



## 说明
GitHub Trending 是根据仓库的最近热门程度展示的，该小程序希望准确获取最近新出现的仓库集合，使用该小程序能够根据语言筛选，获取每天新出现的 Trending 仓库。小程序中首页的数据通过 [trackupdates](https://github.com/ZhuPeng/trackupdates) 抓取获得，展示最近一个月出现在 Trending 上的仓库（只在第一次出现仓库时展示），并通过如下代码 [sync2db.js](sync2db.js) 同步到小程序云开发数据库，提升访问速度和体验。使用微信的云开发方式，极大的简化了小程序的运维。有任何问题，欢迎提交 Issue 和 Pull Request。



## 依赖的开源项目

* [octokit/rest.js](https://github.com/octokit/rest.js): GitHub REST API client for JavaScript
* [TooBug/wemark](https://github.com/TooBug/wemark): 小程序中的 Markdown 渲染仓库
* [youzan/vant-weapp](https://github.com/youzan/vant-weapp): 轻量、可靠的小程序 UI 组件库
* [wux-weapp/wux-weapp](https://github.com/wux-weapp/wux-weapp): 一套组件化、可复用、易扩展的微信小程序 UI 组件库
* [dankogai/js-base64](https://github.com/dankogai/js-base64/): base64 编解码库
* [weui/weui-wxss](https://github.com/weui/weui-wxss): 微信官方的 UI 库
* [resume/resume.github.com](https://github.com/resume/resume.github.com): 自动生成 GitHub 简历


有任何问题，欢迎提交 Issue 或者 PullRequest。