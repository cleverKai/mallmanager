import axios from 'axios'
const myHttpServer = {}
myHttpServer.install = (Vue) => {
  axios.defaults.baseURL = 'http://api.xiaomadagege.cn:8800/api/private/v1/'
  Vue.prototype.$http = axios
}

export default myHttpServer
