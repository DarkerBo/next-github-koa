const client_id = 'dea40cc43d55213d04ce';
const scope = 'user';
const request_code_url = 'https://github.com/login/oauth/authorize';

module.exports = {
  github: {
    client_id,
    client_secret: '422949ff3b0470b1e34865611ea12e2c6935f4eb',
    request_code_url, // 获取github code
    scope, // 获取用户权限
    request_token_url: 'https://github.com/login/oauth/access_token', // 获取github token
    get_user_info: 'https://api.github.com/user', // 获取github用户信息
    GITHUB_OAUTH_URL: request_code_url,
    OAUTH_URL: `${request_code_url}?client_id=${client_id}&scope=${scope}`,
  }
}