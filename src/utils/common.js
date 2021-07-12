// 公共 JS 函数

export default {

  // 获取缓存
  getLocalStorage(name) {
    return JSON.parse(localStorage.getItem(name))
  },
  // 写入缓存
  setLocalStorage(name, value) {
    return localStorage.setItem(name, JSON.stringify(value))
  },
  // 删除缓存
  removeStorage(name) {
    return localStorage.removeItem(name)
  },

  /**
   * @description 判读是否为外链
   */
  isExternal(path) {
    return /^(https?:|mailto:|tel:)/.test(path)
  },
  /**
   * @description 校验密码是否小于6位
   */
  isPassword(str) {
    return str.length >= 6
  },
  /**
   * @description 判断是否为数字
   */
  isNumber(value) {
    const reg = /^[0-9]*$/
    return reg.test(value)
  },
  /**
   * @description 判断是否是名称
   */
  isName(value) {
    const reg = /^[\u4e00-\u9fa5a-zA-Z0-9]+$/
    return reg.test(value)
  },
  /**
   * @description 判断是否为IP
   */
  isIP(ip) {
    const reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
    return reg.test(ip)
  },
  /**
   * @description 判断是否是字符串
   */
  isString(str) {
    return typeof str === 'string' || str instanceof String
  },
  /**
   * @description 判断是否是数组
   */
  isArray(arg) {
    if (typeof Array.isArray === 'undefined') {
      return Object.prototype.toString.call(arg) === '[object Array]'
    }
    return Array.isArray(arg)
  },
  /**
   * @description 判断是否是手机号
   */
  isPhone(str) {
    const reg = /^1\d{10}$/
    return reg.test(str)
  },
  /**
   * @description 判断是否是身份证号(第二代)
   */
  isIdCard(str) {
    const reg = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
    return reg.test(str)
  },

  /**
   * @description 判断是否是邮箱
   */
  isEmail(str) {
    const reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
    return reg.test(str)
  },
  /**
   * @description 判断是否中文
   */
  isChina(str) {
    const reg = /^[\u4E00-\u9FA5]{2,4}$/
    return reg.test(str)
  },
  /**
   * @description 判断是否为空
   */
  isBlank(str) {
    return (
      str == null ||
      false ||
      str === '' ||
      str.trim() === '' ||
      str.toLocaleLowerCase().trim() === 'null'
    )
  },
  /**
   * @description 判断是否为固话
   */
  isTel(str) {
    const reg = /^(400|800)([0-9\\-]{7,10})|(([0-9]{4}|[0-9]{3})(-| )?)?([0-9]{7,8})((-| |转)*([0-9]{1,4}))?$/
    return reg.test(str)
  },
  /**
   * @description 判断是否为数字且最多两位小数
   */
  isNum(str) {
    const reg = /^\d+(\.\d{1,2})?$/
    return reg.test(str)
  },

}
