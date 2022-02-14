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
              label="Add Client"
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
        :data="clients.docs"
        :loading="loading"
        :mobile-cards="false"
        detailed
        paginated
        pagination-size="is-small"
        backend-pagination
        :total="clients.totalDocs"
        :per-page="clients.limit"
        v-on:page-change="changePage"
      >
        <b-table-column field="name" label="Name" v-slot="props">
          {{ props.row.name }}
        </b-table-column>
        <b-table-column field="email" label="Email" v-slot="props">
          {{ props.row.email }}
        </b-table-column>
        <b-table-column field="phone" label="Phone" v-slot="props">
          {{ props.row.phone }}
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

        <template #detail="props">
          <div>
            <ul>
              <li v-for="[key, value] of Object.entries(props.row)" :key="key">
                <b>{{ key }}</b
                >: {{ value }}
              </li>
            </ul>
          </div>
        </template>

        <template #empty>
          <p class="has-text-centered">No Data</p>
        </template>
      </b-table>
    </div>
  </layout-base>
</template>

<script>
import { Base as LayoutBase } from '../../layouts'
import { clientApi } from '../../api'
import { CreateModal, EditModal } from '../../components/client'
import { mapState } from 'vuex'

export default {
  components: { LayoutBase },
  data() {
    return {
      clients: {},
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
      this.getClients()
    },
    'query.status': function () {
      this.getClients()
    },
    'query.sort': function () {
      this.getClients()
    },
    'query.order': function () {
      this.getClients()
    },
    'query.page': function () {
      this.getClients()
    },
  },
  methods: {
    async getClients() {
      this.loading = true

      try {
        const clients = await clientApi.get(this.query)

        this.clients = clients
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
            this.getClients()

            this.$buefy.toast.open({
              type: 'is-success',
              message: 'Client Created',
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
            this.getClients()

            this.$buefy.toast.open({
              type: 'is-success',
              message: 'Client Updated',
            })
          },
        },
      })
    },
    remove(id) {
      this.$buefy.dialog.confirm({
        title: 'Delete Client',
        message: 'Are you sure?',
        confirmText: 'Delete',
        type: 'is-danger',
        onConfirm: async () => {
          await clientApi.delete(id)

          this.getClients()

          this.$buefy.toast.open({
            type: 'is-success',
            message: 'Client Deleted',
          })
        },
      })
    },
    updateStatus(id, status) {
      this.$buefy.dialog.confirm({
        title: status ? 'Deactivate Client' : 'Activate Client',
        message: 'Are you sure?',
        confirmText: status ? 'Deactivate' : 'Activate',
        type: status ? 'is-danger' : 'is-success',
        onConfirm: async () => {
          await clientApi.updateStatus(id, !status)

          this.getClients()

          this.$buefy.toast.open({
            type: 'is-success',
            message: 'Client Updated',
          })
        },
      })
    },
    changePage(page) {
      this.query.page = page
    },
  },
  mounted() {
    this.getClients()

    this.$Progress.finish()
  },
}
</script>
