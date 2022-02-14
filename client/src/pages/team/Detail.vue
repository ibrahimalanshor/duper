<template>
  <layout-base>
    <template #header>
      <header v-if="loading">
        <b-skeleton width="120px" height="24px" rounded></b-skeleton>
      </header>
      <div v-else>
        <header v-if="notfound">
          <h1 class="title">Team Not Found</h1>
          <h2 class="subtitle">The requested team does not exists</h2>

          <b-button
            tag="router-link"
            :to="{ name: 'Team' }"
            type="is-primary"
            label="Back"
            icon-left="arrow-left"
          />
        </header>
        <header class="level mb-5" v-else>
          <div class="level-left">
            <div class="level-item">
              <h1 class="title m-0">{{ team.name }}</h1>
            </div>
          </div>
          <div class="level-right">
            <div class="level-item">
              <b-button
                tag="router-link"
                :to="{ name: 'Team' }"
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
                <b>Leader</b>
                <span>{{ team.leader ? team.leader.name : 'No Leader' }}</span>
              </li>
              <li class="is-flex is-justify-content-space-between">
                <b>Status</b>
                <b-tag :type="team.status ? 'is-success' : 'is-danger'">{{
                  team.status ? 'Active' : 'Inactive'
                }}</b-tag>
              </li>
            </ul>

            <b-button
              :type="team.status ? 'is-danger' : 'is-success'"
              :label="team.status ? 'Deactivate' : 'Activate'"
              expanded
              v-on:click="updateStatus"
              v-if="isAllowed"
            />
          </div>
        </div>
        <div class="column is-8">
          <div class="card card-box">
            <header
              class="card-header is-align-items-center is-justify-content-space-between px-4 py-3"
            >
              <div class="is-flex is-align-items-center">
                <h2 class="card-header-title p-0 mr-2">Member</h2>
                <b-tag type="is-info">{{ team.employees.length }}</b-tag>
              </div>
              <div class="buttons">
                <b-button
                  type="is-info"
                  size="is-small"
                  label="Set Leader"
                  v-on:click="editLeader"
                  v-if="isLeader(user.user._id) || isAllowed"
                />
                <b-button
                  type="is-primary"
                  size="is-small"
                  label="Add Member"
                  v-on:click="createMember"
                  v-if="isLeader(user.user._id) || isAllowed"
                />
              </div>
            </header>
            <div class="card-content">
              <b-table :data="team.employees" bordered>
                <b-table-column field="name" label="Name" v-slot="props">
                  {{ props.row.name }}
                </b-table-column>
                <b-table-column field="role" label="Role" v-slot="props">
                  <b-tag
                    :type="isLeader(props.row._id) ? 'is-danger' : 'is-primary'"
                  >
                    {{ isLeader(props.row._id) ? 'Leader' : 'Member' }}
                  </b-tag>
                </b-table-column>
                <b-table-column
                  width="1%"
                  label="Action"
                  v-slot="props"
                  v-if="isLeader(user.user._id) || isAllowed"
                >
                  <b-button
                    size="is-small"
                    type="is-danger"
                    icon-left="trash"
                    v-on:click="removeMember(props.row._id)"
                  />
                </b-table-column>

                <template #empty>
                  <p class="has-text-centered">No Member</p>
                </template>
              </b-table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </layout-base>
</template>

<script>
import { mapState } from 'vuex'
import { Base as LayoutBase } from '../../layouts'
import { teamApi } from '../../api'
import { CreateMemberModal, EditLeaderModal } from '../../components/team'

export default {
  components: { LayoutBase },
  data() {
    return {
      notfound: false,
      loading: true,
      team: {},
    }
  },
  computed: {
    ...mapState('auth', ['user']),
    isAllowed() {
      return this.user.role === 'admin'
    },
  },
  methods: {
    isLeader(employee_id) {
      return this.team?.leader?._id === employee_id
    },
    async getTeam() {
      this.loading = true

      try {
        const team = await teamApi.show(this.$route.params.id)

        this.team = team
      } catch (err) {
        this.notfound = true
      } finally {
        this.loading = false
      }
    },
    createMember() {
      this.$buefy.modal.open({
        parent: this,
        component: CreateMemberModal,
        hasModalCard: true,
        trapFocus: true,
        props: {
          teamId: this.team._id,
        },
        events: {
          success: () => {
            this.getTeam()

            this.$buefy.toast.open({
              type: 'is-success',
              message: 'Member Created',
            })
          },
        },
      })
    },
    async removeMember(id) {
      this.$buefy.dialog.confirm({
        title: 'Delete Member',
        message: 'Are you sure?',
        confirmText: 'Delete',
        type: 'is-danger',
        onConfirm: async () => {
          await teamApi.removeEmployee(this.team._id, id)

          this.getTeam()

          this.$buefy.toast.open({
            type: 'is-success',
            message: 'Member Deleted',
          })
        },
      })
    },
    editLeader() {
      this.$buefy.modal.open({
        parent: this,
        component: EditLeaderModal,
        hasModalCard: true,
        trapFocus: true,
        props: {
          teamId: this.team._id,
        },
        events: {
          success: () => {
            this.getTeam()

            this.$buefy.toast.open({
              type: 'is-success',
              message: 'Leader Updated',
            })
          },
        },
      })
    },
    updateStatus() {
      this.$buefy.dialog.confirm({
        title: this.team.status ? 'Deactivate Team' : 'Activate Team',
        message: 'Are you sure?',
        confirmText: this.team.status ? 'Deactivate' : 'Activate',
        type: this.team.status ? 'is-danger' : 'is-success',
        onConfirm: async () => {
          await teamApi.updateStatus(this.team._id, !this.team.status)

          this.getTeam()

          this.$buefy.toast.open({
            type: 'is-success',
            message: 'Team Updated',
          })
        },
      })
    },
  },
  mounted() {
    this.getTeam()

    this.$Progress.finish()
  },
}
</script>
