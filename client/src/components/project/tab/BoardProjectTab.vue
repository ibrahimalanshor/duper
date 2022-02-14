<template>
  <div v-if="project">
    <b-button
      type="is-primary"
      label="Add Board"
      icon-left="plus"
      class="mb-4"
      v-on:click="create"
      v-if="isAllowed"
    />
    <div class="columns" v-if="project.boards.length">
      <div
        class="column is-4"
        v-for="(board, key) of project.boards"
        :key="key"
      >
        <router-link
          :to="{
            name: 'Project Board',
            params: { id: project._id, board_id: board._id },
          }"
          class="box board"
        >
          <div
            class="title is-5 is-flex is-align-items-center is-justify-content-space-between mb-0"
          >
            {{ board.name }}
            <b-tag type="is-info" v-if="board.label">{{ board.label }}</b-tag>
          </div>
          <span class="is-block mb-1">{{ board.tasks.length }} Task</span>
          <b-progress
            :value="progressTask(board)"
            :type="board.status ? 'is-success' : 'is-dark'"
            show-value
          >
            {{ doneTask(board) }} / {{ board.tasks.length }} ({{
              board.status ? 'Finished' : 'Active'
            }})
          </b-progress>
        </router-link>
      </div>
    </div>
    <p class="has-text-centered" v-else>No Board</p>
  </div>
</template>

<script>
import { CreateBoardModal } from '../modal'
import { mapState } from 'vuex'

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
        this.user.user._id === this.project.team.leader ||
        this.user.role === 'admin'
      )
    },
  },
  methods: {
    doneTask(board) {
      return board.tasks.filter(task => task.status).length
    },
    progressTask(board) {
      const progress = (this.doneTask(board) / board.tasks.length) * 100
      return progress > 0 ? progress : 0
    },
    create() {
      this.$buefy.modal.open({
        parent: this,
        component: CreateBoardModal,
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
              message: 'Board Created',
            })
          },
        },
      })
    },
  },
}
</script>
