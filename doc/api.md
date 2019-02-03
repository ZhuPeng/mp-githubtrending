微信公众号对外链的访问有严格的控制，文章中除特殊的链接都不能点击，但是对小程序的跳转是没有限制的。故提供如下能力，在公众号文章中可以插入 GitHub 仓库的小程序链接，方便访问仓库的详情提升阅读体验。

公众号写作过程中在编辑器中点击小程序，搜索 `GitHub Trending Hub` 即可添加。

![image-20190204010240928](https://7465-test-3c9b5e-1258459492.tcb.qcloud.la/mp-githubtrending/mini.png)



## 仓库详情页

`/pages/readme/readme?repo=<repo>`

repo 对应具体的仓库路径，格式是 owner/reponame，下图中为 ZhuPeng/mp-githubtrending

![readme](https://7465-test-3c9b5e-1258459492.tcb.qcloud.la/mp-githubtrending/readme.jpeg)



## 仓库中文件（暂时只支持显示 Markdown）

`pages/gitfile/gitfile?`owner=<owner>&repo=<repo>&file=<file>

显示仓库中具体的某个文件，下图中链接为 `owner=ZhuPeng&repo=grab_huaban_board&file=花瓣备份指南.md`

![](https://7465-test-3c9b5e-1258459492.tcb.qcloud.la/mp-githubtrending/md.jpeg)