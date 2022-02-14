import store from '../store'

export default {
  checkToken: (to, from, next) => {
    if (to.meta.requireAuth) {
      if (store.state.auth.token) {
        const { exp } = store.state.auth.user

        if (Date.now() > exp * 1000) {
          store.commit('auth/logout')
        }

        next()
      } else {
        next()
      }
    } else {
      next()
    }
  },
  auth: (to, from, next) => {
    if (to.meta.requireAuth) {
      const { token } = store.state.auth

      if (!token) {
        next({ name: 'Login', query: { redirect: to.fullpath } })
      } else {
        next()
      }
    } else {
      next()
    }
  },
  guest: (to, from, next) => {
    if (to.meta.requireGuest) {
      const { token } = store.state.auth

      if (token) {
        next({ name: 'Dashboard' })
      } else {
        next()
      }
    } else {
      next()
    }
  },
  admin: (to, from, next) => {
    if (to.meta.requireAdmin) {
      const { role } = store.state.auth.user

      if (role !== 'admin') {
        next({ name: 'Not Found' })
      } else {
        next()
      }
    } else {
      next()
    }
  },
  employee: (to, from, next) => {
    if (to.meta.requireEmployee) {
      const { role } = store.state.auth.user

      if (role !== 'employee') {
        next({ name: 'Not Found' })
      } else {
        next()
      }
    } else {
      next()
    }
  },
}
