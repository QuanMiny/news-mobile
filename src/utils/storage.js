export const getItem = name => {
  const data = window.localStorage.getItem(name)
  try {
    // 如果是 JSON 对象转换为 JavaScript 对象，否则就经过 catch 返回原数据
    return JSON.parse(data)
  } catch (err) {
    return data
  }
}

export const setItem = (name, value) => {
  // 如果 value 是对象，就把 value 转为 JSON 格式字符串再存储
  if (typeof value === 'object') {
    value = JSON.stringify(value)
  }
  window.localStorage.setItem(name, value)
}

export const removeItem = name => {
  window.localStorage.removeItem(name)
}
