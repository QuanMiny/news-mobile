/**
 * 搜索相关请求模块
 */
import request from '@/utils/request'

/**
 * 获取搜索联系建议
 */

export const getSearchSuggestions = q => {
  return request({
    method: 'GET',
    url: '/app/v1_0/suggestion',
    params: {
      q // 联想建议关键词
    }
  })
}

/**
 * 获取搜索结果
 */

export const getSearchResult = params => {
  return request({
    method: 'GET',
    url: '/app/v1_0/search',
    params
  })
}
