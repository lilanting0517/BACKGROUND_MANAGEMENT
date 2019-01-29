import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
Vue.use(Vuex)

const state = {
  loading: false,
  modalLoading:false,
  isRegisterOrLogin: false,
  noBook: "./static/nobook.png",
  activeNav: '1-2',
}

export default new Vuex.Store({
  state,
  mutations
})
