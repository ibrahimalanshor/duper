<template>
  <b-navbar type="is-dark">
    <template #brand>
      <b-navbar-item
        class="has-text-weight-bold"
        tag="router-link"
        :to="{ name: 'Dashboard' }"
        >Promin</b-navbar-item
      >
    </template>
    <template #start>
      <b-navbar-item
        v-for="(nav, key) in navs"
        :key="key"
        tag="router-link"
        :to="{ name: nav.route }"
        :active="nav.route === $route.name"
        v-if="checkAllowed(nav)"
        >{{ nav.name }}</b-navbar-item
      >
    </template>
    <template #end>
      <b-navbar-dropdown :label="name" right collapsible>
        <b-navbar-item>Profile</b-navbar-item>
        <b-navbar-item>Setting</b-navbar-item>
        <b-navbar-item v-on:click="processLogout">Logout</b-navbar-item>
      </b-navbar-dropdown>
    </template>
  </b-navbar>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  data() {
    return {
      navs: [
        {
          name: 'Employee',
          route: 'Employee',
        },
        {
          name: 'Team',
          route: 'Team',
        },
        {
          name: 'Project',
          route: 'Project',
        },
        {
          name: 'Client',
          route: 'Client',
        },
        {
          name: 'Admin',
          route: 'Admin',
          requireAdmin: true,
        },
      ],
    }
  },
  computed: {
    ...mapState('auth', ['user']),
    name() {
      return this.user.role === 'admin'
        ? this.user.user.username
        : this.user.user.name
    },
  },
  methods: {
    ...mapMutations('auth', ['logout']),
    processLogout() {
      this.$buefy.dialog.confirm({
        title: 'Logout',
        message: 'Logout from your account?',
        confirmText: 'Logout',
        type: 'is-danger',
        onConfirm: () => {
          this.logout()

          this.$router.push({ name: 'Login' })
        },
      })
    },
    checkAllowed(nav) {
      const role = this.user.role

      if (nav.requireAdmin || nav.requireEmployee) {
        return (
          (nav.requireAdmin && role === 'admin') ||
          (!nav.requireEmployee && role !== 'employee')
        )
      } else {
        return true
      }
    },
  },
}
</script>
