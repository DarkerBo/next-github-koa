import axios from 'axios';
import { request } from '../../utils/handleGithubApi';
import { 
  searchGithubInfoPamamsType, 
  getMyProjectInfoPamamsType,
  getOwnerReposInfoPamamsType,
  getReposReadMeInfoPamamsType,
  getReposIssuesInfoPamamsType,
  getReposIssuesLabelsInfoPamamsType,
  searchUserListInfoParamsType,
  searchIssuesListInfoParamsType
} from './types';

// <-- getInitialProps 客户端和服务端都会访问,因此要判断当前是什么端,这时候就要用request方法 -->

// github 项目搜索接口
export const searchGithubInfo = async (params: searchGithubInfoPamamsType) => {
  const { ctx, data } = params;
  const { req } = ctx;
  const url = '/search/repositories';
  const method = 'GET';

  return await request({ method, url, data }, req);
};

// github 获取我的项目接口
export const getMyProjectInfo = async (params: getMyProjectInfoPamamsType) => {
  const { ctx } = params;
  const { req } = ctx;
  const url = '/user/repos';
  const method = 'GET';

  return await request({ method, url, data: {} }, req);
}

// github 获取我关注的项目接口

export const getMyStarInfo = async (params: getMyProjectInfoPamamsType) => {
  const { ctx } = params;
  const { req } = ctx;
  const url = '/user/starred';
  const method = 'GET';

  return await request({ method, url, data: {} }, req);
}

// github 获取我关注的项目接口

export const getOwnerReposInfo = async (params: getOwnerReposInfoPamamsType) => {
  const { ctx, query } = params;
  const { req } = ctx;
  const { owner, name } = query
  const url = `/repos/${owner}/${name}`;
  const method = 'GET';

  return await request({ method, url, data: {} }, req);
}

// github 获取项目readme接口

export const getReposReadMeInfo = async (params: getReposReadMeInfoPamamsType) => {
  const { ctx, query } = params;
  const { req } = ctx;
  const { owner, name } = query
  const url = `/repos/${owner}/${name}/readme`;
  const method = 'GET';

  return await request({ method, url, data: {} }, req);
}

// github 获取项目issues接口

export const getReposIssuesInfo = async (params: getReposIssuesInfoPamamsType) => {
  const { ctx, query } = params;
  const { req } = ctx;
  const { owner, name } = query
  const url = `/repos/${owner}/${name}/issues`;
  const method = 'GET';

  return await request({ method, url, data: {} }, req);
}

// github 获取项目issues标签列表接口

export const getReposIssuesLabelsInfo = async (params: getReposIssuesLabelsInfoPamamsType) => {
  const { ctx, query } = params;
  const { req } = ctx;
  const { owner, name } = query
  const url = `/repos/${owner}/${name}/labels`;
  const method = 'GET';

  return await request({ method, url, data: {} }, req);
}


// <-- 只需在客户端通过点击按钮等操作调用即可 -->
const _axios = axios.create({
  baseURL: 'https://api.github.com',
  timeout: 5000,
});

// 搜索github 用户列表信息接口 

export const searchUserListInfo = async (params: searchUserListInfoParamsType) => {
  return await _axios.get('/search/users', { params });
};

// 搜索github issues列表信息接口 

export const searchIssuesListInfo = async (params: searchIssuesListInfoParamsType) => {
  const { query, data } = params;
  const { owner, name } = query;

  return await _axios.get(`/repos/${owner}/${name}/issues`, { params: data });
};

