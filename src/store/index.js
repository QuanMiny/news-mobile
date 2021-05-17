import Vue from 'vue'
import Vuex from 'vuex'
import { setItem, getItem } from '@/utils/storage'

Vue.use(Vuex)

const USER_KEY = 'NEWS_USER'

export default new Vuex.Store({
  state: {
    user: getItem(USER_KEY)
  },
  mutations: {
    setUser(state, data) {
      state.user = data
      // 为了防止页面刷新数据丢失，把数据放到本地存储中，实现持久化数据
      setItem(USER_KEY, state.user)
    }
  },
  actions: {},
  modules: {}
})
