import axios from "axios";
import { setupCache } from 'axios-cache-adapter'

export const cache = setupCache({
  maxAge: 15 * 60 * 1000,
  exclude: { query: false, methods:['put', 'patch', 'delete']  } //不加这个请求有参数的时候不会缓存
})

const http = axios.create({
    headers: {
        'x-requested-with': 'XMLHttpRequest',
        'content-type': 'application/json',
        'x-kzz-request-from': 'qcc-kzz-web-mobile',
      },
      baseURL: '/',
      timeout: 1000 * 15,
      
})

// 添加一个请求拦截器
http.interceptors.request.use(function (config) {
  console.log(config.CACHE_API)
    if(config.CACHE_API) {
      config.adapter = cache.adapter
    }
    // 在发送请求之前可以做一些事情
    return config;
  }, function (error) {
    // 处理请求错误
    return Promise.reject(error);
  });
  
  // 添加一个响应拦截器
  http.interceptors.response.use(function (response) {
    // 处理响应数据
    return response;
  }, function (error) {
    // 处理响应错误
    return Promise.reject(error);
  });
  
  export default http