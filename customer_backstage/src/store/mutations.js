export default {
  setLoading(state, val) {
    state.loading = val
  },
  setMLoading(state, val) {
    state.modalLoading = val
  },
  setIsRegisterOrLogin(state, val) {
    state.isRegisterOrLogin = val
  },
  updateActiveNav(state, val) {
    state.activeNav = val;
  },
}
