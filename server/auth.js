const axios = require('axios');
const config = require('../assets/config');

const { client_id, client_secret, request_token_url, get_user_info, OAUTH_URL } = config.github;

// 获取github返回的token
async function getToken (params) {
  const res = await axios({
    method: 'POST',
    url: request_token_url,
    data: params,
    headers: {
      Accept: 'application/json',
    }
  });
  return res;
}

// 获取github用户信息
async function getUserInfo (tokenData = { token_type: 'bearer', access_token: '' }) { 
  const { access_token, token_type } = tokenData;

  const res = await axios({
    method: 'GET',
    url: get_user_info,
    headers: {
      'Authorization': `${token_type} ${access_token}`
    }
  });

  return res;
}

// /auth地址返回处理中间件
module.exports = (server) => {
  // 用户通过访问/auth地址来向github请求token和code 进一步获取用户信息
  server.use(async(ctx, next) => {
    if (ctx.path === '/auth') {
      const code = ctx.query.code;
      if (!code) {
        ctx.body = 'code not exist';
        return;
      }
      const params = {
        client_id,
        client_secret,
        code
      }
      const res = await getToken(params);
      if (res.status === 200 && res.data && !res.data.error) {
        ctx.session.githubAuth = res.data;
        const userInfo = await getUserInfo(res.data);
        // 根据github API获取到用户信息后保存到session中
        ctx.session.userInfo = userInfo.data;
        ctx.redirect(ctx.session && ctx.session.urlBeforeOAuth || '/');
        ctx.session.urlBeforeOAuth = '';
      } else {
        const errorMsg = res.data && res.data.error;
        ctx.body = `request token fail ${errorMsg}`;
      }
    } else {
      await next();
    }
  });

  // 用户登录时获取当前页面的地址
  server.use(async (ctx, next) => {
    const { path, method, url } = ctx;
    if (path === '/api/prepare/auth' && method === 'GET') {
      const { url } = ctx.query;
      ctx.session.urlBeforeOAuth = url;
      ctx.body = 'prepare success';
      // ctx.redirect(OAUTH_URL);
    } else {
      await next();
    }
  })


}