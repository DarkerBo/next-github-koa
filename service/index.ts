import axios from 'axios';

const _axios = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 5000,
});

_axios.interceptors.request.use(
  config => config,
  error => error
);

_axios.interceptors.response.use(
  response => response,
  error => {
    return error.response;
  }
);

export default _axios;