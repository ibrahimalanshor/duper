<template>
  <div class="card card-box mb-5">
    <header
      class="card-header is-align-items-center is-justify-content-space-between px-4 py-3"
    >
      <div class="is-flex is-align-items-center">
        <h2 class="card-header-title p-0 mr-2">Tasks</h2>
        <b-tag type="is-info">{{ tasks.length }}</b-tag>
      </div>
      <div class="buttons">
        <b-button
          type="is-info"
          size="is-small"
          label="Done Selected"
          v-on:click="doneSelected"
          :disabled="true"
        />
        <b-button
          type="is-primary"
          size="is-small"
          label="Add Task"
          v-on:click="create"
          v-if="isLeader"
        />
      </div>
    </header>
    <div class="card-content">
      <b-table
        :data="tasks"
        bordered
        detailed
        :show-detail-icon="false"
        ref="task"
      >
        <b-table-column field="name" label="Name" v-slot="props">
          <span class="mr-2 task-name" v-on:click="toggleDetails(props.row)">{{
            props.row.name
          }}</span>
          <b-tag type="is-info" v-if="props.row.label">{{
            props.row.label
          }}</b-tag>
        </b-table-column>
        <b-table-column field="estimate" label="Estimate" v-slot="props">
          {{
            props.row.estimate
              ? new Date(props.row.estimate).toDateString()
              : '-'
          }}
        </b-table-column>
        <b-table-column field="worker" label="Worker" v-slot="props">
          {{ props.row.worker ? props.row.worker.name : '-' }}
        </b-table-column>
        <b-table-column width="20%" label="Action" v-slot="props">
          <div class="buttons">
            <b-button
              size="is-small"
              type="is-success"
              icon-left="check"
              v-on:click="done(props.row._id)"
              :disabled="!checkWorker(props.row.worker)"
            />
            <b-dropdown v-if="isLeader">
              <template #trigger>
                <b-button size="is-small" label="Actions" />
              </template>

              <b-dropdown-item v-on:click="assignWorker(props.row._id)"
                >Assign Worker</b-dropdown-item
              >
              <b-dropdown-item v-on:click="edit(props.row)"
                >Edit</b-dropdown-item
              >
              <b-dropdown-item
                class="has-text-danger"
                v-on:click="remove(props.row._id)"
                >Delete</b-dropdown-item
              >
            </b-dropdown>
          </div>
        </b-table-column>

        <template #detail="props">
          <p>
            {{
              props.row.description ? props.row.description : 'No Description'
            }}
          </p>
        </template>

        <template #empty>
          <p class="has-text-centered">No Task</p>
        </template>
      </b-table>
    </div>
  </div>
</template>

<style>
.task-name {
  cursor: pointer;
}
</style>

<script>
import { projectApi } from '../../../api'
import { CreateTaskModal, AssignWorkerModal, EditTaskModal } from '../modal'
import { mapState } from 'vuex'

export default {
  props: {
    teamId: {
      type: String,
      required: true,
    },
    projectId: {
      type: String,
      required: true,
    },
    boardId: {
      type: String,
      required: true,
    },
    tasks: {
      type: Array,
      required: true,
    },
    isLeader: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapState('auth', ['user']),
  },
  methods: {
    async done(taskId) {
      try {
        await projectApi.updateStatusTask(
          this.projectId,
          this.boardId,
          taskId,
          true
        )

        this.$emit('reload')
      } catch (err) {
        console.log(err)
      }
    },
    async doneSelected() {
      console.log('ok')
    },
    create() {
      this.$buefy.modal.open({
        parent: this,
        component: CreateTaskModal,
        hasModalCard: true,
        trapFocus: true,
        props: {
          projectId: this.projectId,
          boardId: this.boardId,
        },
        events: {
          success: () => {
            this.$emit('reload')

            this.$buefy.toast.open({
              type: 'is-success',
              message: 'Task Created',
            })
          },
        },
      })
    },
    edit(task) {
      this.$buefy.modal.open({
        parent: this,
        component: EditTaskModal,
        hasModalCard: true,
        trapFocus: true,
        props: {
          projectId: this.projectId,
          boardId: this.boardId,
          taskData: task,
        },
        events: {
          success: () => {
            this.$emit('reload')

            this.$buefy.toast.open({
              type: 'is-success',
              message: 'Task Updated',
            })
          },
        },
      })
    },
    remove(taskId) {
      this.$buefy.dialog.confirm({
        title: 'Delete Task',
        message: 'Are you sure?',
        confirmText: 'Delete',
        type: 'is-danger',
        onConfirm: async () => {
          await projectApi.removeTask(this.projectId, this.boardId, taskId)

          this.$emit('reload')

          this.$buefy.toast.open({
            type: 'is-success',
            message: 'Task Deleted',
          })
        },
      })
    },
    assignWorker(taskId) {
      this.$buefy.modal.open({
        parent: this,
        component: AssignWorkerModal,
        hasModalCard: true,
        trapFocus: true,
        props: {
          teamId: this.teamId,
          projectId: this.projectId,
          boardId: this.boardId,
          taskId: taskId,
        },
        events: {
          success: () => {
            this.$emit('reload')

            this.$buefy.toast.open({
              type: 'is-success',
              message: 'Worker Assigned',
            })
          },
        },
      })
    },
    toggleDetails(row) {
      this.$refs.task.toggleDetails(row)
    },
    checkWorker(worker) {
      return this.user.user._id === worker?._id
    },
  },
}
</script>
