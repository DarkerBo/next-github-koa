const axios = require('axios');

const GITHUB_BASE_URL = 'https://api.github.com';

const isServer = typeof window === 'undefined';

// 服务端环境需要手动拼接url,否则默认传递端口80,导致请求地址错误
async function requestGithub(method, url, data, headers) {
  if (!url) {
    throw new Error('url must be provided')
  }

  const _axios = axios.create();

  let result;

  if (method === 'GET') {
    result = await _axios.get(`${GITHUB_BASE_URL}${url}`, { params: data, headers });
  } else {
    result = await _axios.post(`${GITHUB_BASE_URL}${url}`, data, {
      headers
    });
  }

  return result;
}

// 流程：客户段请求服务端，服务端请求github
async function request({ method = 'GET', url, data = {} }, req) {
  if (isServer) {
    const { session } = req;
    const { githubAuth } = session || {};
    const { access_token, token_type } = githubAuth || {};
    const headers = {};
    if (access_token) {
      headers.Authorization = `${token_type} ${access_token}`;
    }
    // 服务端走requestGithub方法，
    // 补全api的前缀
    const serverResult = await requestGithub(method, url, data, headers);
    return serverResult;
  }

  // 客户端需要拼接github前缀 让koa的server可以识别并代理

  const _axios = axios.create();

  let clientResult;

  if (method === 'GET') {
    clientResult = await _axios.get(`/github${url}`, { params: data });
  } else {
    clientResult = await _axios.post(`/github${url}`, data);
  }

  return clientResult;
}

module.exports = {
  request,
  requestGithub,
}
