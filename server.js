const Koa = require('koa');
const Router = require('koa-router');
const session = require('koa-session');
const koaBody = require('koa-body');
const next = require('next');
const Redis = require('ioredis');
const auth = require('./server/auth');
const changeGithubApi = require('./server/change-github-api');
const atob = require('atob');

const  RedisSessionStore = require('./server/session-store');

// 给node全局增加atob方法
global.atob = atob;

// 判断是否处于开发环境
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

// 创建Redis client
const redis = new Redis({
  port: 6379, // Redis port
  host: "127.0.0.1", // Redis host
  password: "123456",
});

app.prepare().then(() => {
  const server = new Koa();
  const router = new Router();

  // session 设置
  server.keys = ['Github App Demo'];
  const SESSION_CONFIG = {
    key: 'session_key',
    store: new RedisSessionStore(redis)
  }

  server.use(session(SESSION_CONFIG, server));
  
  // 解析post请求的内容
  server.use(koaBody());

  // 配置处理github OAuth的登录
  auth(server);

  // 处理github请求代理
  changeGithubApi(server);

  // 客户端获取用户信息接口 将session中的userInfo返回客户端
  router.get('/api/user/info', async(ctx) => {
    const userInfo = ctx.session.userInfo;
    if (!userInfo) {
      ctx.status = 401;
      ctx.body = 'You need login';
    } else {
      ctx.body = userInfo;
      ctx.set('Content-Type', 'application/json');
    }
  });

  // 用户退出登录清空session
  router.post('/api/user/logout', async(ctx) => {
    ctx.session = null;
    ctx.body = 'logout success';
  });

  server.use(router.routes());

  server.use(async (ctx) => {
    ctx.req.session = ctx.session;
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
  })

  server.listen(3000, () => {
    console.log('koa server listening on 3000');
  })
})