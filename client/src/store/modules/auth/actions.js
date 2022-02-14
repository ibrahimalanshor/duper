import jwt_decode from 'jwt-decode'

export default {
  setAuth({ commit }, token) {
    commit('setToken', token)
    commit('setUser', jwt_decode(token))
  },
}
