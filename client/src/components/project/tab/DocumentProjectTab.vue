<template>
  <div>
    <b-button
      type="is-primary"
      icon-left="plus"
      label="Add Document"
      class="mb-3"
      v-on:click="create"
      v-if="isAllowed"
    />
    <b-table :data="project.documents" bordered>
      <b-table-column field="name" label="Name" v-slot="props">
        <a :href="props.row.url" target="_blank">{{ props.row.name }}</a>
      </b-table-column>
      <b-table-column field="action" label="Action" v-slot="props">
        <div class="buttons">
          <b-button
            tag="a"
            target="_blank"
            :href="props.row.url"
            size="is-small"
            type="is-primary"
            icon-left="download"
          />
          <b-button
            size="is-small"
            type="is-success"
            icon-left="edit"
            v-on:click="edit(props.row)"
            v-if="isAllowed"
          />
          <b-button
            size="is-small"
            type="is-danger"
            icon-left="trash"
            v-on:click="remove(props.row._id)"
            v-if="isAllowed"
          />
        </div>
      </b-table-column>

      <template #empty>
        <p class="has-text-centered">Empty Document</p>
      </template>
    </b-table>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { projectApi } from '../../../api'
import { CreateDocumentModal, EditDocumentModal } from '../modal'

export default {
  props: {
    project: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapState('auth', ['user']),
    isAllowed() {
      return (
        this.project.team.employees.some(
          employee => employee === this.user.user._id
        ) || this.user.role === 'admin'
      )
    },
  },
  methods: {
    create() {
      this.$buefy.modal.open({
        parent: this,
        component: CreateDocumentModal,
        hasModalCard: true,
        trapFocus: true,
        props: {
          project: this.project,
        },
        events: {
          success: () => {
            this.$emit('reload')

            this.$buefy.toast.open({
              type: 'is-success',
              message: 'Document Created',
            })
          },
        },
      })
    },
    edit(document) {
      this.$buefy.modal.open({
        parent: this,
        component: EditDocumentModal,
        hasModalCard: true,
        trapFocus: true,
        props: {
          project: this.project,
          data: document,
        },
        events: {
          success: () => {
            this.$emit('reload')

            this.$buefy.toast.open({
              type: 'is-success',
              message: 'Document Updated',
            })
          },
        },
      })
    },
    remove(document_id) {
      this.$buefy.dialog.confirm({
        title: 'Delete Document',
        message: 'Are you sure?',
        confirmText: 'Delete',
        type: 'is-danger',
        onConfirm: async () => {
          await projectApi.removeDocument(this.project._id, document_id)

          this.$emit('reload')

          this.$buefy.toast.open({
            type: 'is-success',
            message: 'Document Removed',
          })
        },
      })
    },
  },
}
</script>
