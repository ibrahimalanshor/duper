<template>
  <form v-on:submit.prevent="store" class="px-4">
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Add Document</p>
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
          <b-input placeholder="Name" v-model="document.name" />
        </b-field>
        <b-field
          label="File"
          :type="errors.file ? 'is-danger' : ''"
          :message="errors.file ? errors.file.msg : ''"
          expanded
        >
          <b-upload placeholder="File" v-model="document.file" expanded>
            <b-button
              tag="a"
              :type="errors.file ? 'is-danger' : ''"
              :label="document.file ? document.file.name : 'Click To Upload'"
              icon-left="upload"
              expanded
            />
          </b-upload>
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
      document: {
        name: '',
        file: null,
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
        const formData = new FormData()

        formData.append('name', this.document.name)
        formData.append('file', this.document.file)

        await projectApi.pushDocument(this.project._id, formData)

        this.$emit('success')
        this.$emit('close')
      } catch (err) {
        if (err.response?.status === 422) {
          this.errors = err.response.data.errors
        } else if (err.response?.status === 415) {
          this.errors = {
            file: { msg: 'Filetype not accepted' },
          }
        }
      } finally {
        this.loading = false
      }
    },
  },
}
</script>
