<template>
  <layout-base>
    <template #header>
      <h1 class="title">{{ $route.name }}</h1>
    </template>

    <div class="columns">
      <div class="column is-one-quarter">
        <router-link :to="{ name: 'Employee' }">
          <div class="box has-background-info has-text-info-light">
            <h2 class="has-text-weight-bold">Employee</h2>
            <span>Count: 8</span>
          </div>
        </router-link>
      </div>
      <div class="column is-one-quarter">
        <router-link :to="{ name: 'Team' }">
          <div class="box has-background-danger has-text-danger-light">
            <h2 class="has-text-weight-bold">Team</h2>
            <span>Count: 2</span>
          </div>
        </router-link>
      </div>
      <div class="column is-one-quarter">
        <router-link :to="{ name: 'Project' }">
          <div class="box has-background-primary has-text-primary-light">
            <h2 class="has-text-weight-bold">Project</h2>
            <span>Count: 10</span>
          </div>
        </router-link>
      </div>
      <div class="column is-one-quarter">
        <router-link :to="{ name: 'Client' }">
          <div class="box has-background-success has-text-success-light">
            <h2 class="has-text-weight-bold">Client</h2>
            <span>Count: 3</span>
          </div>
        </router-link>
      </div>
    </div>
  </layout-base>
</template>

<script>
import { Base as LayoutBase } from '../layouts'

export default {
  components: { LayoutBase },
  mounted() {
    this.$Progress.finish()
  },
}
</script>
