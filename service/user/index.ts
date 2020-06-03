import axios from '../index';
import { backCurrentPageParamsType } from './types';

// 用户登陆后获取用户信息接口
export const getUserInfo = async () => {
  return await axios.get('/api/user/info');
};

// 用户退出登录接口
export const userLogout = async () => {
  return await axios.post('/api/user/logout');
}

// 用户请求github oauth登录后返回当前页面接口
export const backCurrentPage = async (params: backCurrentPageParamsType) => {
  return await axios.get('/api/prepare/auth', { params });
};
