<template>
  <form v-on:submit.prevent="store" class="px-4">
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Add Task</p>
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
          <b-input placeholder="Name" v-model="task.name" />
        </b-field>
        <b-field
          label="Label"
          :type="errors.label ? 'is-danger' : ''"
          :message="errors.label ? errors.label.msg : ''"
          expanded
        >
          <b-input placeholder="Label" v-model="task.label" />
        </b-field>
        <b-field
          label="Estimate"
          :type="errors.estimate ? 'is-danger' : ''"
          :message="errors.estimate ? errors.estimate.msg : ''"
          expanded
        >
          <b-datepicker placeholder="Estimate" v-model="task.estimate" />
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
            v-model="task.description"
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
    projectId: {
      type: String,
      required: true,
    },
    boardId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      task: {
        name: '',
        label: '',
        estimate: new Date(),
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
        const body = this.task

        if (!body.description) delete body.description
        if (!body.label) delete body.label

        await projectApi.pushTask(this.projectId, this.boardId, body)

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
