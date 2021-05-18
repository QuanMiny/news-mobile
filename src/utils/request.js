/**
 * 封装 axios 请求模块
 */
import axios from 'axios'
import store from '@/store/'

const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/' // 基础路径
})

// Add a request interceptor 请求拦截器
request.interceptors.request.use(
  function(config) {
    // Do something before request is sent
    const { user } = store.state
    // 如果用户已登录，统一给接口设置 token 信息
    if (user) {
      config.headers.Authorization = `Bearer ${user.token}`
    }
    return config
  },
  function(error) {
    // Do something with request error
    return Promise.reject(error)
  }
)

export default request
