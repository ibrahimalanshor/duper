<template>
  <layout-auth>
    <h1 class="title has-text-centered">Login</h1>
    <form class="box" v-on:submit.prevent="login">
      <b-field
        label="Username"
        :type="errors.username ? 'is-danger' : ''"
        :message="errors.username ? errors.username.msg : ''"
        v-if="role === 'admin'"
      >
        <b-input placeholder="Username" v-model="user.username" />
      </b-field>
      <b-field
        label="Email"
        :type="errors.email ? 'is-danger' : ''"
        :message="errors.email ? errors.email.msg : ''"
        v-else
      >
        <b-input placeholder="Email" type="email" v-model="user.email" />
      </b-field>
      <b-field
        label="Password"
        :type="errors.password ? 'is-danger' : ''"
        :message="errors.password ? errors.password.msg : ''"
      >
        <b-input
          type="password"
          placeholder="Password"
          v-model="user.password"
        />
      </b-field>
      <b-field label="Role">
        <b-select placeholder="Role" expanded v-model="role">
          <option value="admin">Admin</option>
          <option value="employee">Employee</option>
        </b-select>
      </b-field>
      <b-button
        native-type="submit"
        type="is-primary"
        label="Login"
        expanded
        :loading="loading"
      />
    </form>
  </layout-auth>
</template>

<script>
import { Auth as LayoutAuth } from '../layouts'
import { authApi } from '../api'
import { mapActions } from 'vuex'

export default {
  components: { LayoutAuth },
  data() {
    return {
      user: {
        email: '',
        username: '',
        password: '',
      },
      role: 'admin',
      loading: false,
      errors: {},
    }
  },
  methods: {
    ...mapActions('auth', ['setAuth']),
    async login() {
      this.loading = true
      this.errors = {}

      try {
        let token

        if (this.role === 'admin') {
          const { username, password } = this.user

          token = await authApi.loginAdmin({ username, password })
        } else {
          const { email, password } = this.user

          token = await authApi.loginEmployee({ email, password })
        }

        this.setAuth(token)

        this.$router.push(this.$route.query.redirect ?? { name: 'Dashboard' })
      } catch (err) {
        if (err.response?.status === 422) {
          this.errors = err.response.data.errors
        } else if (err.response?.status === 401) {
          this.errors = {
            password: {
              msg: err.response.data.message,
            },
          }
        }
      } finally {
        this.loading = false
      }
    },
  },
  mounted() {
    this.$Progress.finish()
  },
}
</script>
