![](https://7465-test-3c9b5e-1258459492.tcb.qcloud.la/mp-githubtrending/WechatGithub.jpeg)

## [推荐使用 Chrome 插件一键排版小程序链接](https://github.com/ZhuPeng/mp-transform-public)

微信公众号对外链的访问有严格的控制，文章中除特殊的链接都不能点击，但是对小程序的跳转是没有限制的。故提供如下能力，在公众号文章中可以插入 GitHub 仓库的小程序链接，方便访问仓库的详情提升阅读体验。 

公众号写作过程中在编辑器中点击小程序，搜索 `GitHub Trending Hub` 即可添加。

![image-20190204010240928](https://7465-test-3c9b5e-1258459492.tcb.qcloud.la/mp-githubtrending/mini.png)

在小程序路径填写要访问的 GitHub 地址，如 `https://github.com/ZhuPeng/mp-githubtrending` 会自动转换为小程序可以识别的页面路由

后续是小程序详细 API 的介绍，如果只需要在公众号添加 GitHub 对应的链接，按上面的操作即可。
如果你的公众号关联或者文章中添加过本小程序，欢迎在 [Issue](https://github.com/ZhuPeng/mp-githubtrending/issues/9) 中留下你的公众号。



## 个人账户页

`pages/account/account?owner=<owner>`

owner 对应登陆 GitHub 后的名称

![owner](https://7465-test-3c9b5e-1258459492.tcb.qcloud.la/mp-githubtrending/owner.jpeg)



## 仓库详情页

在小程序路径填写要访问的 GitHub 地址，如 `https://github.com/ZhuPeng/mp-githubtrending` 会自动转换为小程序可以识别的如下页面路由

`pages/readme/readme?repo=<repo>`

repo 对应具体的仓库路径，格式是 owner/reponame，下图中为 ZhuPeng/mp-githubtrending

![readme](https://7465-test-3c9b5e-1258459492.tcb.qcloud.la/mp-githubtrending/readme.jpeg)



## 仓库中文件

在小程序路径填写要访问的 GitHub 地址，如 `https://github.com/ZhuPeng/mp-githubtrending/blob/master/doc/api.md` 会自动转换为小程序可以识别的如下页面路由

`pages/gitfile/gitfile?owner=<owner>&repo=<repo>&file=<file>`

显示仓库中具体的某个文件，下图中链接为 `owner=ZhuPeng&repo=grab_huaban_board&file=花瓣备份指南.md`

![](https://7465-test-3c9b5e-1258459492.tcb.qcloud.la/mp-githubtrending/md.jpeg)


## 用户简历

`pages/resume/resume?name=<name>`

`name` 是 GitHub 对应的用户名称


另外通过如上提供的 API，可以通过 GitHub 构建自己的 Markdown 小程序个人博客，只需通过 Git 管理自己 Markdown 文件，轻松管理发布同时便于管理版本。
