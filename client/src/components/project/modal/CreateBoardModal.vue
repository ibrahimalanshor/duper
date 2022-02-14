<template>
  <form v-on:submit.prevent="store" class="px-4">
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Add Board</p>
        <button
          type="button"
          class="delete"
          v-on:click="$emit('close')"
        ></button>
      </header>
      <section class="modal-card-body">
        <b-field
          label="Name"
          :type="errors.name ? 'is-danger' : ''"
          :message="errors.name ? errors.name.msg : ''"
          expanded
        >
          <b-input placeholder="Name" v-model="board.name" />
        </b-field>
        <b-field
          label="Label"
          :type="errors.label ? 'is-danger' : ''"
          :message="errors.label ? errors.label.msg : ''"
          expanded
        >
          <b-input placeholder="Label" v-model="board.label" />
        </b-field>
        <b-field
          label="Description"
          :type="errors.description ? 'is-danger' : ''"
          :message="errors.description ? errors.description.msg : 'Optional'"
          expanded
        >
          <b-input
            type="textarea"
            placeholder="Description"
            v-model="board.description"
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
      board: {
        name: '',
        label: '',
        description: '',
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
        const body = this.board

        if (!body.description) delete body.description
        if (!body.label) delete body.label

        await projectApi.pushBoard(this.project._id, body)

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
