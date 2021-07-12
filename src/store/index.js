import Vue from 'vue'
import Vuex from 'vuex'

//挂载Vuex
Vue.use(Vuex)

//创建VueX对象
const store = new Vuex.Store({
  state: {
    permissions_add: false,
    permissions_del: false,
    permissions_cat: false,
    permissions_edi: false,

  },
  mutations: {
    add(state,val) {
      state.permissions_add = val
    },
    del(state,val) {
      state.permissions_del = val
    },
    cat(state,val) {
      state.permissions_cat = val
    },
    edit(state,val) {
      state.permissions_edi = val
    },
  },
})

export default store
