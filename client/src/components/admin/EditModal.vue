<template>
  <form v-on:submit.prevent="store" class="px-4">
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Edit Admin</p>
        <button
          type="button"
          class="delete"
          v-on:click="$emit('close')"
        ></button>
      </header>
      <section class="modal-card-body">
        <b-field
          label="Username"
          :type="errors.username ? 'is-danger' : ''"
          :message="errors.username ? errors.username.msg : ''"
          expanded
        >
          <b-input placeholder="Username" v-model="admin.username" />
        </b-field>
        <b-field
          label="Password"
          :type="errors.password ? 'is-danger' : ''"
          :message="errors.password ? errors.password.msg : ''"
          expanded
        >
          <b-input
            type="password"
            placeholder="Password"
            v-model="admin.password"
          />
        </b-field>
      </section>
      <footer class="modal-card-foot">
        <b-button label="Cancel" v-on:click="$emit('close')" />
        <b-button
          label="Save"
          native-type="submit"
          type="is-primary"
          :loading="loading"
        />
      </footer>
    </div>
  </form>
</template>

<script>
import { adminApi } from '../../api'

export default {
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      admin: {
        username: this.data.username,
        password: this.data.password,
      },
      errors: {},
      loading: false,
    }
  },
  methods: {
    async store() {
      this.loading = true
      this.errors = {}

      try {
        await adminApi.update(this.data._id, this.admin)

        this.$emit('success')
        this.$emit('close')
      } catch (err) {
        if (err.response?.status === 422) {
          this.errors = err.response.data.errors
        }
      } finally {
        this.loading = false
      }
    },
  },
}
</script>
