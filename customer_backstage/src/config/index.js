/* 开发环境地址配置 */
const dev = {
  baseUrl: "http://200.1.3.234:5566/api",
  uploadUrl: "http://200.1.3.234:5566/api",
  downloadUrl: ""
}
/* 生产环境地址配置 */
const prod = {
  // baseUrl:"http://192.168.9.201:5566/api",
  baseUrl: "http://opbsb.etjbooks.com.cn/api",
  // baseUrl: "http://testOpbsb.cnonixdata.com/api",
  // baseUrl:"http://200.1.3.234:5566/api",
  uploadUrl: "http://opbsb.etjbooks.com.cn/api",
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
