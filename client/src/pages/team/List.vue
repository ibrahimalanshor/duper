<template>
  <layout-base>
    <template #header>
      <header class="level mb-5">
        <div class="level-left">
          <div class="level-item">
            <h1 class="title m-0">{{ $route.name }}</h1>
          </div>
        </div>
        <div class="level-right">
          <div class="level-item is-flex-wrap-wrap">
            <b-dropdown>
              <template #trigger>
                <b-button label="Search" icon-left="search" type="is-warning" />
              </template>

              <b-dropdown-item custom>
                <b-field label="Name">
                  <b-input placeholder="Name" v-model="query.name" />
                </b-field>
              </b-dropdown-item>
            </b-dropdown>
            <b-dropdown>
              <template #trigger>
                <b-button label="Filter" icon-left="filter" type="is-warning" />
              </template>

              <b-dropdown-item custom>
                <b-field label="Status">
                  <b-select
                    placeholder="Status"
                    v-model="query.status"
                    expanded
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                    <option value="">All</option>
                  </b-select>
                </b-field>
              </b-dropdown-item>
            </b-dropdown>
            <b-dropdown>
              <template #trigger>
                <b-button label="Sort" icon-left="sort" type="is-warning" />
              </template>

              <b-dropdown-item custom>
                <b-field label="Sort By">
                  <b-select placeholder="Sort By" v-model="query.sort" expanded>
                    <option value="name">Name</option>
                    <option value="position">Position</option>
                    <option value="">Created</option>
                  </b-select>
                </b-field>
              </b-dropdown-item>
              <b-dropdown-item custom>
                <b-field label="Order By">
                  <b-select
                    placeholder="Order By"
                    v-model="query.order"
                    expanded
                  >
                    <option value="">Asc</option>
                    <option value="desc">Desc</option>
                  </b-select>
                </b-field>
              </b-dropdown-item>
            </b-dropdown>
            <b-button
              class="ml-2"
              label="Add Team"
              icon-left="plus"
              type="is-primary"
              v-on:click="create"
              v-if="user.role === 'admin'"
            />
          </div>
        </div>
      </header>
    </template>

    <div class="box p-0">
      <b-table
        class="box-table"
        :data="teams.docs"
        :loading="loading"
        :mobile-cards="false"
        paginated
        pagination-size="is-small"
        backend-pagination
        :total="teams.totalDocs"
        :per-page="teams.limit"
        v-on:page-change="changePage"
      >
        <b-table-column field="name" label="Name" v-slot="props">
          <router-link
            :to="{ name: 'Team Detail', params: { id: props.row._id } }"
            >{{ props.row.name }}</router-link
          >
        </b-table-column>
        <b-table-column field="leader" label="Leader" v-slot="props">
          {{ props.row.leader ? props.row.leader.name : 'No Leader' }}
        </b-table-column>
        <b-table-column field="leader" label="Member" v-slot="props">
          <b-tag type="is-primary"
            >{{ props.row.employees.length }} Employees</b-tag
          >
        </b-table-column>
        <b-table-column field="status" label="Status" v-slot="props">
          <b-tag :type="props.row.status ? 'is-success' : 'is-danger'">{{
            props.row.status ? 'Active' : 'Inactive'
          }}</b-tag>
        </b-table-column>
        <b-table-column
          label="Action"
          v-slot="props"
          v-if="user.role === 'admin'"
        >
          <b-dropdown>
            <template #trigger>
              <b-button size="is-small" label="Action"></b-button>
            </template>

            <b-dropdown-item v-on:click="edit(props.row)">Edit</b-dropdown-item>
            <b-dropdown-item
              v-on:click="updateStatus(props.row._id, props.row.status)"
              class="has-text-danger"
              v-if="props.row.status"
              >Deactivate</b-dropdown-item
            >
            <b-dropdown-item
              v-on:click="updateStatus(props.row._id, props.row.status)"
              class="has-text-success"
              v-else
              >Activate</b-dropdown-item
            >
            <b-dropdown-item
              v-on:click="remove(props.row._id)"
              class="has-text-danger"
              >Delete</b-dropdown-item
            >
          </b-dropdown>
        </b-table-column>

        <template #empty>
          <p class="has-text-centered">No Data</p>
        </template>
      </b-table>
    </div>
  </layout-base>
</template>

<script>
import { Base as LayoutBase } from '../../layouts'
import { teamApi } from '../../api'
import { CreateModal, EditModal } from '../../components/team'
import { mapState } from 'vuex'

export default {
  components: { LayoutBase },
  data() {
    return {
      teams: {},
      loading: true,
      query: {
        name: '',
        status: '',
        sort: '',
        order: '',
        limit: 10,
        page: 1,
      },
    }
  },
  computed: {
    ...mapState('auth', ['user']),
  },
  watch: {
    'query.name': function () {
      this.getTeams()
    },
    'query.status': function () {
      this.getTeams()
    },
    'query.sort': function () {
      this.getTeams()
    },
    'query.order': function () {
      this.getTeams()
    },
    'query.page': function () {
      this.getTeams()
    },
  },
  methods: {
    async getTeams() {
      this.loading = true

      try {
        const teams = await teamApi.get(this.query)

        this.teams = teams
      } catch (err) {
        console.log(err)
      } finally {
        this.loading = false
      }
    },
    create() {
      this.$buefy.modal.open({
        parent: this,
        component: CreateModal,
        hasModalCard: true,
        trapFocus: true,
        events: {
          success: () => {
            this.getTeams()

            this.$buefy.toast.open({
              type: 'is-success',
              message: 'Team Created',
            })
          },
        },
      })
    },
    edit(data) {
      this.$buefy.modal.open({
        parent: this,
        component: EditModal,
        hasModalCard: true,
        trapFocus: true,
        props: { data },
        events: {
          success: () => {
            this.getTeams()

            this.$buefy.toast.open({
              type: 'is-success',
              message: 'Team Updated',
            })
          },
        },
      })
    },
    remove(id) {
      this.$buefy.dialog.confirm({
        title: 'Delete Team',
        message: 'Are you sure?',
        confirmText: 'Delete',
        type: 'is-danger',
        onConfirm: async () => {
          await teamApi.delete(id)

          this.getTeams()

          this.$buefy.toast.open({
            type: 'is-success',
            message: 'Team Deleted',
          })
        },
      })
    },
    updateStatus(id, status) {
      this.$buefy.dialog.confirm({
        title: status ? 'Deactivate Team' : 'Activate Team',
        message: 'Are you sure?',
        confirmText: status ? 'Deactivate' : 'Activate',
        type: status ? 'is-danger' : 'is-success',
        onConfirm: async () => {
          await teamApi.updateStatus(id, !status)

          this.getTeams()

          this.$buefy.toast.open({
            type: 'is-success',
            message: 'Team Updated',
          })
        },
      })
    },
    changePage(page) {
      this.query.page = page
    },
  },
  mounted() {
    this.getTeams()

    this.$Progress.finish()
  },
}
</script>
