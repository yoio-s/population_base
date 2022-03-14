import http from '../utils/http'

export default {
  // 登录
  getAdminLogin(tableName, type, data) {
    return http.post('/apis/dwh/' + tableName + '/sign_in?proj=' + type, data)
  },
  // 注册
  getAdminRegister(tableName, type, data) {
    return http.post('/apis/dwh/user/sign_up?proj=' + type, data)
  },
  // 退出
  getAdminQuit(tableName, type, data) {
    return http.post('/apis/dwh/' + tableName + '/sign_out?proj=' + type, data)
  },
  // 发送短信验证码
  postSMSCode(tableName, type, data) {
    return http.post('/apis/dwh/' + tableName + '/sendSMSCode?proj=' + type, data)
  },
  // 数据
  getListData(table, data) {
    return http.post('/apis/dwh/' + table.name + '/list?proj=' + table.type + '&page=' + table.page + '&page_size=' + table.pageSize, data)
  },
  // 数据
  getAllListData(tableName, type, data) {
    return http.post('/apis/dwh/' + tableName + '/list?proj=' + type, data)
  },
  // 表结构信息
  getListStructure(tableName, type, data) {
    return http.post('/apis/dwh/' + tableName + '/info?proj=' + type, data)
  },
  // 导入表格
  putListData(tableName, type, data) {
    return http.post('/apis/dwh/' + tableName + '/import?proj=' + type, data)
  },
  // 导入表格file格式
  putListDataFile(tableName, type, data) {
    return http.post('/apis/dwh/' + tableName + '/importFile?proj=' + type, data)
  },
  // 查询导入状态
  importStatus(tableName, type, data) {
    return http.post('/apis/dwh/' + tableName + '/importStatus?proj=' + type, data)
  },
  // 查询导入记录
  importQueryLog(tableName, type, data) {
    return http.post('/apis/dwh/' + tableName + '/importTasks?proj=' + type, data)
  },
  // 添加数据
  addListData(tableName, type, data) {
    return http.post('/apis/dwh/' + tableName + '/add?proj=' + type, data)
  },
  // 删除数据
  deleteListData(tableName, type, data) {
    return http.post('/apis/dwh/' + tableName + '/delete?proj=' + type, data)
  },
  // 删除所有数据
  deleteAllDataApi(tableName, type, data) {
    return http.post('/apis/dwh/' + tableName + '/emptyData?proj=' + type, data)
  },
  // 修改数据
  modifyListData(tableName, type, data) {
    return http.post('/apis/dwh/' + tableName + '/update?proj=' + type, data)
  },
  // 获取可访问的数据表
  getAllTable(data) {
    return http.post('/apis/dwh/tables', data)
  },
  // 录入三方数据
  postEntry(data) {
    return http.get('/WMServer/wiseMotion/process/7ef7c3bb-8e10-11ec-bcb2-525400a05fe3', data)
  },
  // skylark code 登陆
  postSkylarkCode(data) {
    return http.post('/apis/dwh/thirdAuth', data)
  },
}
