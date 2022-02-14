import axios from 'axios'
import store from '../store'
import router from '../router'

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

http.interceptors.request.use(config => {
  if (store.state.auth.token) {
    const { exp } = store.state.auth.user

    if (Date.now() > exp * 1000) {
      store.commit('auth/logout')
    }

    return config
  } else {
    router.push({ name: 'Login' })
  }
})

export default http
