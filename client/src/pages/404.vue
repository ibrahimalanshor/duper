<template>
  <div
    class="wrapper columns px-4 is-mobile is-align-items-center is-justify-content-center"
  >
    <div class="column is-12-mobile is-8-tablet is-6-desktop">
      <div class="box">
        <h1 class="title">404 Not Found</h1>
        <h2 class="subtitle">Your requested page not found</h2>
        <hr />
        <b-button
          tag="router-link"
          :to="{ name: 'Dashboard' }"
          icon-left="arrow-left"
          type="is-primary"
          label="Home"
        />
      </div>
    </div>
  </div>
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

<style>
.wrapper {
  height: 100vh;
}
</style>
