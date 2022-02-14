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

              <b-dropdown-item custom>
                <b-field label="Position">
                  <b-input placeholder="Position" v-model="query.position" />
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
              label="Add Employee"
              icon-left="plus"
              type="is-primary"
              v-if="user.role === 'admin'"
              v-on:click="create"
            />
          </div>
        </div>
      </header>
    </template>

    <div class="box p-0">
      <b-table
        class="box-table"
        :data="employees.docs"
        :loading="loading"
        :mobile-cards="false"
        detailed
        paginated
        pagination-size="is-small"
        backend-pagination
        :total="employees.totalDocs"
        :per-page="employees.limit"
        v-on:page-change="changePage"
      >
        <b-table-column field="name" label="Name" v-slot="props">
          {{ props.row.name }}
        </b-table-column>
        <b-table-column field="email" label="Email" v-slot="props">
          {{ props.row.email }}
        </b-table-column>
        <b-table-column field="position" label="Position" v-slot="props">
          {{ props.row.position }}
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
import { employeeApi } from '../../api'
import { CreateModal, EditModal } from '../../components/employee'
import { mapState } from 'vuex'

export default {
  components: { LayoutBase },
  data() {
    return {
      employees: {},
      loading: true,
      query: {
        name: '',
        position: '',
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
      this.getEmployees()
    },
    'query.position': function () {
      this.getEmployees()
    },
    'query.status': function () {
      this.getEmployees()
    },
    'query.sort': function () {
      this.getEmployees()
    },
    'query.order': function () {
      this.getEmployees()
    },
    'query.page': function () {
      this.getEmployees()
    },
  },
  methods: {
    async getEmployees() {
      this.loading = true

      try {
        const employees = await employeeApi.get(this.query)

        this.employees = employees
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
            this.getEmployees()

            this.$buefy.toast.open({
              type: 'is-success',
              message: 'Employee Created',
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
            this.getEmployees()

            this.$buefy.toast.open({
              type: 'is-success',
              message: 'Employee Updated',
            })
          },
        },
      })
    },
    remove(id) {
      this.$buefy.dialog.confirm({
        title: 'Delete Employee',
        message: 'Are you sure?',
        confirmText: 'Delete',
        type: 'is-danger',
        onConfirm: async () => {
          await employeeApi.delete(id)

          this.getEmployees()

          this.$buefy.toast.open({
            type: 'is-success',
            message: 'Employee Deleted',
          })
        },
      })
    },
    updateStatus(id, status) {
      this.$buefy.dialog.confirm({
        title: status ? 'Deactivate Employee' : 'Activate Employee',
        message: 'Are you sure?',
        confirmText: status ? 'Deactivate' : 'Activate',
        type: status ? 'is-danger' : 'is-success',
        onConfirm: async () => {
          await employeeApi.updateStatus(id, !status)

          this.getEmployees()

          this.$buefy.toast.open({
            type: 'is-success',
            message: 'Employee Updated',
          })
        },
      })
    },
    changePage(page) {
      this.query.page = page
    },
  },
  mounted() {
    this.getEmployees()

    this.$Progress.finish()
  },
}
</script>
