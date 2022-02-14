<template>
  <div>
    <navbar />

    <div class="container px-4 my-6">
      <slot name="header"></slot>

      <slot></slot>
    </div>
  </div>
</template>

<script>
import { Navbar } from '../components'
export default {
  components: { Navbar },
}
</script>
