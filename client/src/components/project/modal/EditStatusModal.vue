<template>
  <form v-on:submit.prevent="store" class="px-4">
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Edit Status</p>
        <button
          type="button"
          class="delete"
          v-on:click="$emit('close')"
        ></button>
      </header>
      <section class="modal-card-body">
        <b-field
          label="Status"
          :type="errors.status ? 'is-danger' : ''"
          :message="errors.status ? errors.status.msg : ''"
          expanded
        >
          <b-select placeholder="Status" v-model="status" expanded>
            <option value="active">Active</option>
            <option value="finish">Finished</option>
            <option value="failed">Failed</option>
          </b-select>
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
import { projectApi } from '../../../api'

export default {
  props: {
    project: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      status: this.project.status,
      errors: {},
      loading: false,
    }
  },
  methods: {
    async store() {
      this.loading = true
      this.errors = {}

      try {
        await projectApi.updateStatus(this.project._id, this.status)

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
