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
                    <option value="active">Active</option>
                    <option value="finish">Finished</option>
                    <option value="failed">Failed</option>
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
              label="Add Project"
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
        :data="projects.docs"
        :loading="loading"
        :mobile-cards="false"
        paginated
        pagination-size="is-small"
        backend-pagination
        :total="projects.totalDocs"
        :per-page="projects.limit"
        v-on:page-change="changePage"
      >
        <b-table-column field="name" label="Name" v-slot="props">
          <router-link
            :to="{ name: 'Project Detail', params: { id: props.row._id } }"
            >{{ props.row.name }}</router-link
          >
        </b-table-column>
        <b-table-column field="created" label="Created" v-slot="props">
          {{
            props.row.createdAt
              ? new Date(props.row.createdAt).toDateString()
              : '-'
          }}
        </b-table-column>
        <b-table-column field="estimate" label="Estimate" v-slot="props">
          {{
            props.row.estimate
              ? new Date(props.row.estimate).toDateString()
              : '-'
          }}
        </b-table-column>
        <b-table-column field="client" label="Client" v-slot="props">
          {{ props.row.client ? props.row.client.name : 'No Client' }}
        </b-table-column>
        <b-table-column field="team" label="Team" v-slot="props">
          <router-link
            :to="{ name: 'Team Detail', params: { id: props.row.team._id } }"
            >{{ props.row.team.name }}</router-link
          >
        </b-table-column>
        <b-table-column field="status" label="Status" v-slot="props">
          <b-tag :type="projectStatus(props.row.status).color">{{
            projectStatus(props.row.status).text
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
              v-on:click="updateStatus(props.row)"
              v-if="props.row.status"
              >Edit Status</b-dropdown-item
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
import { projectApi } from '../../api'
import {
  CreateModal,
  EditModal,
  EditStatusModal,
} from '../../components/project/modal'
import { mapState } from 'vuex'

export default {
  components: { LayoutBase },
  data() {
    return {
      projects: {},
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
      this.getProjects()
    },
    'query.status': function () {
      this.getProjects()
    },
    'query.sort': function () {
      this.getProjects()
    },
    'query.order': function () {
      this.getProjects()
    },
    'query.page': function () {
      this.getProjects()
    },
  },
  methods: {
    async getProjects() {
      this.loading = true

      try {
        const projects = await projectApi.get(this.query)

        this.projects = projects
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
            this.getProjects()

            this.$buefy.toast.open({
              type: 'is-success',
              message: 'Project Created',
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
            this.getProjects()

            this.$buefy.toast.open({
              type: 'is-success',
              message: 'Project Updated',
            })
          },
        },
      })
    },
    remove(id) {
      this.$buefy.dialog.confirm({
        title: 'Delete Project',
        message: 'Are you sure?',
        confirmText: 'Delete',
        type: 'is-danger',
        onConfirm: async () => {
          await projectApi.delete(id)

          this.getProjects()

          this.$buefy.toast.open({
            type: 'is-success',
            message: 'Project Deleted',
          })
        },
      })
    },
    updateStatus(project) {
      this.$buefy.modal.open({
        parent: this,
        component: EditStatusModal,
        hasModalCard: true,
        trapFocus: true,
        props: { project },
        events: {
          success: () => {
            this.getProjects()

            this.$buefy.toast.open({
              type: 'is-success',
              message: 'Project Updated',
            })
          },
        },
      })
    },
    changePage(page) {
      this.query.page = page
    },
    projectStatus(status) {
      const attrs = {
        active: {
          text: 'Active',
          color: 'is-primary',
        },
        finish: {
          text: 'Finished',
          color: 'is-success',
        },
        failed: {
          text: 'Failed',
          color: 'is-danger',
        },
      }

      return attrs[status]
    },
  },
  mounted() {
    this.getProjects()

    this.$Progress.finish()
  },
}
</script>
