const { requestGithub } = require('../utils/handleGithubApi');

module.exports = (server) => {
  server.use(async (ctx, next) => {
    const { path, url, method } = ctx;

    // 捕捉到有github标识的请求地址都代理到github的服务器上
    const proxyPrefix = '/github/';
    if (path.startsWith(proxyPrefix)) {

      const { session } = ctx;
      const { githubAuth } = session || {};
      const { access_token, token_type } = githubAuth || {};
      const headers = {};
      if (access_token) {
        headers.Authorization = `${token_type} ${access_token}`;
      }
      const result = await requestGithub(
        method,
        url.replace('/github/', '/'),
        ctx.request.body,
        headers,
      )
      ctx.status = result.status;
      ctx.body = result.data;

    } else {
      await next();
    }
  })
}
