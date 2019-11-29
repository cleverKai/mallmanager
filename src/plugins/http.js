import axios from 'axios'
const myHttpServer = {}
myHttpServer.install = (Vue) => {
  axios.defaults.baseURL = 'http://api.xiaomadagege.cn:8800/api/private/v1/'
  // 添加请求拦截器
  axios.interceptors.request.use(function (config) {
    // 在发送请求之前做什么
    // 判断请求是否为登录请求，如果不是就添加请求头
    // 除了登录请求以外，其他所有请求都需要在请求头部携带token
    if (config.url !== 'login') {
      const AUTH_TOKEN = localStorage.getItem('token')
      config.headers['Authorization'] = AUTH_TOKEN
    }
    return config
  }, function (err) {
    return Promise.reject(err)
  })
  // 添加响应拦截器
  axios.interceptors.response.use(function (response) {
    // 在响应数据时操作
    return response
  }, function (err) {
    return Promise.reject(err)
  })
  Vue.prototype.$http = axios
}

export default myHttpServer
