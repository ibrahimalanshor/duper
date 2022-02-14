<template>
  <layout-base>
    <template #header>
      <header v-if="loading">
        <b-skeleton width="120px" height="24px" rounded></b-skeleton>
      </header>
      <div v-else>
        <header v-if="notfound">
          <h1 class="title">Board Not Found</h1>
          <h2 class="subtitle">The requested board does not exists</h2>

          <b-button
            tag="router-link"
            :to="{ name: 'Project' }"
            type="is-primary"
            label="Back"
            icon-left="arrow-left"
          />
        </header>
        <header class="level mb-5" v-else>
          <div class="level-left">
            <div class="level-item">
              <div>
                <p class="heading">{{ project.name }}</p>
                <h1 class="title">
                  {{ board.name }}
                  <b-tag type="is-info" v-if="board.label">{{
                    board.label
                  }}</b-tag>
                </h1>
              </div>
            </div>
          </div>
          <div class="level-right">
            <div class="level-item">
              <b-button
                tag="router-link"
                :to="{
                  name: 'Project Detail',
                  params: { id: project._id },
                  query: { tab: 'board' },
                }"
                icon-left="arrow-left"
                label="Back"
              />
            </div>
          </div>
        </header>
      </div>
    </template>

    <div class="columns mt-4" v-if="loading">
      <div class="column is-4">
        <b-skeleton height="200px"></b-skeleton>
      </div>
      <div class="column is-8">
        <b-skeleton height="200px"></b-skeleton>
      </div>
    </div>

    <div v-else>
      <div class="columns" v-if="!notfound">
        <div class="column is-4">
          <div class="box">
            <ul class="mb-4">
              <li class="is-flex is-justify-content-space-between mb-2">
                <b>Status</b>
                <b-tag :type="board.status ? 'is-success' : 'is-primary'">{{
                  board.status ? 'Finished' : 'Active'
                }}</b-tag>
              </li>
              <li class="is-flex is-justify-content-space-between">
                <b>Total Task</b>
                <b-tag type="is-info"
                  >{{ doneTasks.length }} / {{ board.tasks.length }}</b-tag
                >
              </li>
            </ul>

            <div v-if="board.description">
              <hr />

              <p>{{ board.description }}</p>

              <hr />
            </div>

            <b-progress
              :value="progress"
              :type="board.status ? 'is-success' : 'is-dark'"
              show-value
            >
              {{ doneTasks.length }} / {{ board.tasks.length }} ({{
                board.status ? 'Finished' : 'Active'
              }})
            </b-progress>
          </div>

          <div class="box" v-if="isAllowed">
            <b-button
              type="is-info"
              :label="board.status ? 'Open' : 'Finish'"
              :icon-left="board.status ? 'folder-open' : 'check'"
              expanded
              class="mb-2"
              v-on:click="finishBoard"
            />
            <b-button
              type="is-success"
              label="Edit"
              icon-left="edit"
              expanded
              class="mb-2"
              v-on:click="edit"
            />
            <b-button
              type="is-danger"
              label="Delete"
              icon-left="trash"
              expanded
              class="mb-2"
              v-on:click="remove"
            />
          </div>
        </div>
        <div class="column is-8">
          <task-list
            :team-id="project.team._id"
            :project-id="project._id"
            :board-id="board._id"
            :tasks="tasks"
            :is-leader="isAllowed"
            v-on:reload="getBoard"
          />
          <done-list
            :project-id="project._id"
            :board-id="board._id"
            :tasks="doneTasks"
            :is-leader="isAllowed"
            v-on:reload="getBoard"
          />
        </div>
      </div>
    </div>
  </layout-base>
</template>

<script>
import { mapState } from 'vuex'
import { Base as LayoutBase } from '../../layouts'
import { projectApi } from '../../api'
import { EditBoardModal } from '../../components/project/modal'
import { TaskList, DoneList } from '../../components/project/task'

export default {
  components: { LayoutBase, TaskList, DoneList },
  data() {
    return {
      notfound: false,
      loading: true,
      project: {},
    }
  },
  computed: {
    ...mapState('auth', ['user']),
    board() {
      return this.project.boards[0]
    },
    tasks() {
      return this.board.tasks.filter(task => !task.status)
    },
    doneTasks() {
      return this.board.tasks.filter(task => task.status)
    },
    progress() {
      const progress = (this.doneTasks.length / this.board.tasks.length) * 100

      return progress > 0 ? progress : 0
    },
    isAllowed() {
      return (
        this.user.user._id === this.project.team.leader ||
        this.user.role === 'admin'
      )
    },
  },
  methods: {
    async getBoard() {
      this.loading = true

      try {
        const project = await projectApi.showBoard(
          this.$route.params.id,
          this.$route.params.board_id
        )

        this.project = project
      } catch (err) {
        this.notfound = true
      } finally {
        this.loading = false
      }
    },
    edit() {
      this.$buefy.modal.open({
        parent: this,
        component: EditBoardModal,
        hasModalCard: true,
        trapFocus: true,
        props: {
          project: this.project,
          boardData: this.board,
        },
        events: {
          success: () => {
            this.getBoard()

            this.$buefy.toast.open({
              type: 'is-success',
              message: 'Board Updated',
            })
          },
        },
      })
    },
    remove() {
      this.$buefy.dialog.confirm({
        title: 'Delete Board',
        message: 'Are you sure?',
        confirmText: 'Delete',
        type: 'is-danger',
        onConfirm: async () => {
          await projectApi.removeBoard(this.project._id, this.board._id)

          this.$router.push({
            name: 'Project Detail',
            params: { id: this.project._id },
            query: { tab: 'board' },
          })

          this.$buefy.toast.open({
            type: 'is-success',
            message: 'Board Deleted',
          })
        },
      })
    },
    finishBoard() {
      this.$buefy.dialog.confirm({
        title: this.board.status ? 'Open Board' : 'Finish Board',
        message: 'Are you sure?',
        confirmText: this.board.status ? 'Open' : 'Finish',
        type: this.board.status ? 'is-danger' : 'is-success',
        onConfirm: async () => {
          await projectApi.updateStatusBoard(
            this.project._id,
            this.board._id,
            !this.board.status
          )

          this.getBoard()

          this.$buefy.toast.open({
            type: 'is-success',
            message: 'Board Updated',
          })
        },
      })
    },
  },
  mounted() {
    this.getBoard()

    this.$Progress.finish()
  },
}
</script>
