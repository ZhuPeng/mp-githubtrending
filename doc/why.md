## 小程序 GitHub Trending Hub 的由来

小程序 `GitHub Trending Hub` 是一个以 Feed 流形式查看 GitHub Trending 仓库集合的工具，通过它可以及时查看最近更新的热门仓库。通过微信 WeChat 扫码体验。

![qrcode](https://7465-test-3c9b5e-1258459492.tcb.qcloud.la/qrcode.jpg?sign=d350a14b8d342714aa7c7246cd6a41fa&t=1548588526)



### 为什么要开发？

相信很多人会有这样的疑问，通过官方提供的 GitHub Trending 页面就能查看，为什么还要开发一个小程序？细心的同学可能会发现 GitHub Trending 上榜大致是按照当天新增的 Star 数来确定的，Star 数会随着时间变动，意味着 Trending 榜单也是随时在变的。那么对于像我一样经常浏览 GitHub Trending 页面的人会存在一些不便的地方：

* 每次访问 GitHub Trending 获取的新仓库数量相对少，那些比较热门的项目往往长期霸占 Trending 榜单，有时候今天看了，需要过几天再去看才能在上面发现一些新的有意思的项目
* 对于那些短期出现在 Trending 上的项目由于没有及时查看而丢失了
* 不能按多语言过滤，使用多个编程语言的人还是比较多的

这大概就是最开始的需求，希望能够及时的追踪到 GitHub Trending 榜单的变化，形成历史信息方便查看更新。很自然就会想到用爬虫解决这个问题，当时还没有小程序，开发小程序是因为工作关系了解到 Serverless 相关的知识，同时微信小程序有对应的云开发方式，迫切希望了解一下具体的应用场景。所以就有了开发这个小程序的想法。



### 追踪网站变化

除了经常浏览 GitHub Trending 之外，有时候也会看一些技术博客，比如 GitHub Blog、Kubernetes Blog、CoreOS Blog 等，有的是不提供 RSS 订阅的（当然我也不是一个 RSS 订阅的爱好者），由于不知道什么时候会更新，所以只能空闲时去查看对应的页面。爬虫大法好，对于多个网站每个都单独写爬虫比较费劲同时增加了管理的负担，所以希望能够开发一个通用的爬虫框架，能够比较简单的配置就能新增一个追踪网站变化的爬虫。当时刚好工作上在了解 Prometheus 和 Alermanager，就参考对应的配置，开发了基于 xpath 的爬虫框架，通过邮件以日报或者周报形式追踪特定网站的更新。

```json
parsers:
- name: 'githubtrending'
  base_url: 'https://github.com'
  base_xpath:
  - "//li[@class='col-12 d-block width-full py-4 border-bottom']"
  attr:
    url: 'div/h3/a/@href'
    repo: 'div/h3/a'
    desc: "div[@class='py-1']/p"
    lang: "div/span[@itemprop='programmingLanguage']"
    star: "div/a[@aria-label='Stargazers']"
    fork: "div/a[@aria-label='Forks']"
    today: "div/span[@class='float-right']"
```

后续由于工作上需要参与一些前端的开发，所以就在周末学习 antd 增加了方便查看的页面。可以说这个项目和当时工作上的内容是高度契合、相互促进的。

![](https://7465-test-3c9b5e-1258459492.tcb.qcloud.la/trackupdates/webui.png)

可以访问体验：https://zhupeng.github.io/trackupdates/

>项目地址：https://github.com/ZhuPeng/trackupdates
>
>欢迎 Star 和 Fork，有任何问题欢迎提交 Issue。



### 微信小程序

小程序给人最直观的体验就是无需安装软件，可以在微信内快速体验。当时 trackupdates 服务是没有服务器，运行在我自己电脑里面，用手机在碎片时间查看非常不方便，所以还是为了满足自己的需求（程序员造轮子是不是都是先满足自己的需求？哈哈~）。

随着自己在工作中产品思维的积累，当时的想法是既然要开发一个对外可用的产品，为何不在满足自己需求的同时也能方便他人呢？所以需要挖掘和分析具体需要解决的问题和痛点，以及如何更好的推广这个产品。

当时发现微信公众号中的文章对外链的访问有严格的控制，文章中除特殊的链接都不能点击，但是对小程序的跳转是没有限制的。在小程序里面也是一样的，一般的外链跳转都是不允许的（个人开发类型的小程序），同时也调研了已经存在的 GitHub 相关的小程序，无一例外在链接跳转上都存在很多的问题。所以在开发小程序的过程中友好的 GitHub 的链接跳转是被最重点关注和优化的问题，同时这也是怎么去推广这个小程序的方向。

目前有 GitHub精选、AI研习社两个公众号在文章中附加小程序链接的方式，来提升访问 GitHub 仓库详情的阅读体验。如果你的公众号文章中分享了 GitHub 相关的项目可以扫描如下二维码查看添加小程序指南。

二维码

除此之外，小程序还提供了查看仓库统计和个人简历的功能。

![](https://7465-test-3c9b5e-1258459492.tcb.qcloud.la/mp-githubtrending/mimip-index.jpeg)

![](https://7465-test-3c9b5e-1258459492.tcb.qcloud.la/mp-githubtrending/minip-stats.jpeg)

![](https://7465-test-3c9b5e-1258459492.tcb.qcloud.la/mp-githubtrending/minip-resume.jpeg)

小程序使用的是微信原生的框架开发，如果你希望学习小程序开发的话，应该能对你有所帮助。

> 项目地址：https://github.com/ZhuPeng/mp-githubtrending
>
> 欢迎 Star 和 Fork，有任何问题欢迎提交 Issue。



### 开发感想和总结

* GitHub API 设计

  为了降低开发成本，同时提高后续更换 API 的便捷性，GitHub API 的返回结果中会包含你可能访问的其他 API，对于开发者来说就不需要去理解和拼接 API 了。

  >All resources may have one or more `*_url` properties linking to other resources. These are meant to provide explicit URLs so that proper API clients don't need to construct URLs on their own. It is highly recommended that API clients use these. Doing so will make future upgrades of the API easier for developers. All URLs are expected to be proper [RFC 6570](http://tools.ietf.org/html/rfc6570) URI templates.

  

  ```json
  {
      "id": 1296269,
      "name": "Hello-World",
      "full_name": "octocat/Hello-World",
      "html_url": "https://github.com/octocat/Hello-World",
      "description": "This your first repo!",
      "url": "https://api.github.com/repos/octocat/Hello-World",
      "archive_url": "http://api.github.com/repos/octocat/Hello-World/{archive_format}{/ref}",
      "assignees_url": "http://api.github.com/repos/octocat/Hello-World/assignees{/user}"
  }
  ```

  现在 GitHub 已经推荐使用 GraphQL API v4 版本了，将小程序 API 迁移到 GraphQL 版本已经列入下一个学习的计划了。

  

* 小程序云开发

  云开发里面打包了常用的基础组件，如数据库、存储、无服务框架、监控和数据统计报表等，极大简化了服务的运维部署成本，不用关心服务在哪里运行，不用关心是否需要扩容，可以让开发更多的关注业务逻辑。如下就是一个简单的服务：

  ```
  const cloud = require('wx-server-sdk')
  
  exports.main = async (event, context) => ({
    sum: event.a + event.b
  })
  ```

  但是相对来说成熟度还不够，如果碰到问题，查起来比较困难。例如我就碰到了小程序的 API 被爬虫抓取了（后来查到是微信自己的爬虫，尴尬了~），导致云开发套餐的流量被瞬间用完了，由于云开发暴露的能力有限不好去排查以及解决这个问题。