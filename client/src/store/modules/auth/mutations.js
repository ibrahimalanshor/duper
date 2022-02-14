export default {
  setToken(state, token) {
    state.token = token
  },
  setUser(state, user) {
    state.user = user
  },
  logout(state) {
    state.token = null
    state.user = null
  },
}
