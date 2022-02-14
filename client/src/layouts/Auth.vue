<template>
  <div class="container px-4">
    <div
      class="auth columns is-mobile is-align-items-center is-justify-content-center"
    >
      <div class="column is-12-mobile is-6-tablet is-4-desktop">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<style>
.auth {
  height: 100vh;
}
</style>
