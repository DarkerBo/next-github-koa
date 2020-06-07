# Github 浏览系统

### 前言

本项目基于 Next.js 和 Koa 框架实现。主要实现了 GitHub 账号的第三方登录，查询阅览 GitHub 项目和展现项目的 Issues 详情等功能。服务端渲染 SSR 是一种利于 SEO 和页面加载速度的技术。此项目也是我初次对服务端渲染 SSR 的一个小探索吧。





### 技术栈

- [x] **服务端渲染框架：** Next.js
- [x] **前端开发语法：** React Hook
- [x] **前端类型注解：** Typescript
- [x] **Node.js框架：** Koa
- [x] **数据存储：** Redis
- [x] **第三方登录：** GitHub OAUTH
- [x] **CSS 处理：** Styled Components





### 项目主要结构

```
├── assets          // 静态资源和公共文件
├── components      // 公共组件
├── pages           // 页面组件 会被解析成对应地址的路由
├── server          // Koa中间件和Redis设置等文件
├── service         // 接口相关文件
├── store           // 状态管理相关文件
├── utils           // 公共方法，如时间处理，缓存方法等
├── next.config.js  // next配置文件
├── server.js       // Koa启动文件
```





### 运行效果图

* **第三方登录**

![第三方登录](D:/前端开发/Project/graduation/habit_formation_font/[https:/github.com/DarkerBo/next-github-koa/blob/master/readmeImages/GitHub第三方登录.gif](https:/github.com/DarkerBo/next-github-koa/blob/master/readmeImages/GitHub第三方登录.gif))

* **查询项目**

![查询项目](D:/前端开发/Project/graduation/habit_formation_font/[https:/github.com/DarkerBo/next-github-koa/blob/master/readmeImages/查询项目.gif](https:/github.com/DarkerBo/next-github-koa/blob/master/readmeImages/查询项目.gif))

* **项目详情**

![项目详情](D:/前端开发/Project/graduation/habit_formation_font/[https:/github.com/DarkerBo/next-github-koa/blob/master/readmeImages/项目详情.gif](https:/github.com/DarkerBo/next-github-koa/blob/master/readmeImages/项目详情.gif))

* **项目issues**

![项目issues]([https://github.com/DarkerBo/next-github-koa/blob/master/readmeImages/项目issues.gif](https://github.com/DarkerBo/next-github-koa/blob/master/readmeImages/项目issues.gif))





### 注意事项

启动该项目前需要安装 Redis 并成功运行 Redis，本项目的 Redis 存储设置了密码，若所启用的Redis并没有设置密码或者密码与本项目的不同，可以在`server.js`文件中修改 Redis 相关配置。

`server.js`

~~~js
// 在该处配置Redis
const redis = new Redis({
  port: 6379, // Redis port
  host: "127.0.0.1", // Redis host
  password: "123456",
});
~~~





### 感谢

***

* [Next.js 官方网站](https://nextjs.org/)

* [GitHub API 文档](https://developer.github.com/)

* [ioredis GitHub 地址](https://github.com/luin/ioredis)

* [React16.8+Next.js+Koa2开发Github全栈项目](https://coding.imooc.com/class/334.html)





