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
                <b-field label="Username">
                  <b-input placeholder="Username" v-model="query.username" />
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
                    <option value="username">Username</option>
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
              label="Add Admin"
              icon-left="plus"
              type="is-primary"
              v-on:click="create"
            />
          </div>
        </div>
      </header>
    </template>

    <div class="box p-0">
      <b-table
        class="box-table"
        :data="admins.docs"
        :loading="loading"
        :mobile-cards="false"
        detailed
        paginated
        pagination-size="is-small"
        backend-pagination
        :total="admins.totalDocs"
        :per-page="admins.limit"
        v-on:page-change="changePage"
      >
        <b-table-column field="username" label="Username" v-slot="props">
          {{ props.row.username }}
        </b-table-column>
        <b-table-column label="Action" v-slot="props">
          <b-dropdown>
            <template #trigger>
              <b-button size="is-small" label="Action"></b-button>
            </template>

            <b-dropdown-item v-on:click="edit(props.row)">Edit</b-dropdown-item>
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
import { adminApi } from '../../api'
import { CreateModal, EditModal } from '../../components/admin'

export default {
  components: { LayoutBase },
  data() {
    return {
      admins: {},
      loading: true,
      query: {
        username: '',
        sort: '',
        order: '',
        limit: 10,
        page: 1,
      },
    }
  },
  watch: {
    'query.username': function () {
      this.getAdmins()
    },
    'query.sort': function () {
      this.getAdmins()
    },
    'query.order': function () {
      this.getAdmins()
    },
    'query.page': function () {
      this.getAdmins()
    },
  },
  methods: {
    async getAdmins() {
      this.loading = true

      try {
        const admins = await adminApi.get(this.query)

        this.admins = admins
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
            this.getAdmins()

            this.$buefy.toast.open({
              type: 'is-success',
              message: 'Admin Created',
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
            this.getAdmins()

            this.$buefy.toast.open({
              type: 'is-success',
              message: 'Admin Updated',
            })
          },
        },
      })
    },
    remove(id) {
      this.$buefy.dialog.confirm({
        title: 'Delete Admin',
        message: 'Are you sure?',
        confirmText: 'Delete',
        type: 'is-danger',
        onConfirm: async () => {
          await adminApi.delete(id)

          this.getAdmins()

          this.$buefy.toast.open({
            type: 'is-success',
            message: 'Admin Deleted',
          })
        },
      })
    },
    changePage(page) {
      this.query.page = page
    },
  },
  mounted() {
    this.getAdmins()

    this.$Progress.finish()
  },
}
</script>
