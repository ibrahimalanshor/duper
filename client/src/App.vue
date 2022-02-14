<template>
  <div>
    <vue-progress-bar />

    <router-view />
  </div>
</template>

<script>
export default {
  created() {
    this.$Progress.start()

    this.$router.beforeEach((to, from, next) => {
      this.$Progress.start()

      next()
    })
  },
}
</script>

<style>
.box-table .level {
  padding: 0.5em 0.75em;
}
.box-table .table-wrapper {
  margin-bottom: 0 !important;
  border-bottom: 1px solid #dbdbdb;
}
.card-box .card-header {
  border-bottom: 1px solid #dbdbdb;
}
</style>
