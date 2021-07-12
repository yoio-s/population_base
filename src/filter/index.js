
export function isNull(val) {
  if (!val) {
    return '暂无'
  } else {
    return val
  }
}

export function isBan(val) {
  if (val === '1') {
    return '正常'
  } else if (val === '2') {
    return '已删除'
  } else if (val === '3') {
    return '禁用'
  }
}

export function tableName(val) {
  if (val === 'rkk') {
    return '人口库'
  } else if (val === 'jjk') {
    return '经济库'
  }
}

export function isWhether(val) {
  if (val === '0') {
    return '否'
  } else if (val === '1') {
    return '是'
  }
}

// export function timeFormat(value, rid) {
//   // 用法 传入时间戳 10位 13位都可以
//   // 传入rid(number) 如果不传  时间格式为 xx年xx月xx日
//   let d
//   let id = rid || 3
//
//   if (value !== 0) {
//     if (id === null) {
//       d = new DateStyle(value)
//     } else {
//       d = new DateStyle(value, id)
//     }
//     value = d.style()
//     return value
//   } else {
//     value = '长期有效'
//     return value
//   }
// }
