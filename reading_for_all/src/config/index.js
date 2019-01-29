/* 开发环境地址配置 */
const dev = {
  // baseUrl: "  https://easy-mock.com/mock/5b29bfc9353194793efa871e/reading",
  baseUrl:"http://200.1.3.234/qmyd/api",
  // baseUrl:"http://200.1.3.181:8008/api/",
  uploadUrl: "",
  downloadUrl: ""
}

/* 生产环境地址配置 */
const prod = {
  baseUrl: "http://opqmyd.etjbooks.com.cn/api/",
  uploadUrl: "",
  downloadUrl: ""
}

const env = process.env.NODE_ENV

let Api

if (env === 'development') {
  Api = dev
} else {
  Api = prod
}

export default Api
