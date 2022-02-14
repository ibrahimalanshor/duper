<template>
  <form v-on:submit.prevent="store" class="px-4">
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Add Member</p>
        <button
          type="button"
          class="delete"
          v-on:click="$emit('close')"
        ></button>
      </header>
      <section class="modal-card-body">
        <b-field
          label="Employee"
          :type="errors.employee_id ? 'is-danger' : ''"
          :message="errors.employee_id ? errors.employee_id.msg : ''"
          expanded
        >
          <b-autocomplete
            placeholder="Employee"
            field="name"
            :data="employees"
            :loading="searching"
            v-on:focus="showEmployees"
            v-on:select="selectEmployee"
            v-on:input="findEmployee"
            v-on:infinite-scroll="scrollEmployees"
            clearable
            open-on-focus
            append-to-body
            check-infinite-scroll
          >
            <template #empty>No Results Found</template>
          </b-autocomplete>
        </b-field>
      </section>
      <footer class="modal-card-foot">
        <b-button label="Cancel" v-on:click="$emit('close')" />
        <b-button
          label="Save"
          native-type="submit"
          type="is-primary"
          :loading="loading"
        />
      </footer>
    </div>
  </form>
</template>

<script>
import { teamApi, employeeApi } from '../../api'

export default {
  props: {
    teamId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      employee: {},
      employees: [],
      employeesQuery: {
        sort: 'name',
        status: 'true',
        limit: 10,
      },
      errors: {},
      loading: false,
      searching: false,
    }
  },
  methods: {
    async store() {
      this.loading = true
      this.errors = {}

      try {
        await teamApi.pushEmployee(this.teamId, this.employee._id)

        this.$emit('success')
        this.$emit('close')
      } catch (err) {
        if (err.response?.status === 422) {
          this.errors = err.response.data.errors
        }
      } finally {
        this.loading = false
      }
    },
    async showEmployees() {
      this.searching = true

      try {
        const employees = await employeeApi.get(this.employeesQuery)

        this.employees = employees.docs
      } catch (err) {
        console.log(err)
      } finally {
        this.searching = false
      }
    },
    selectEmployee(val) {
      this.employee = val
    },
    findEmployee(val) {
      this.employeesQuery.name = val

      this.showEmployees()
    },
    scrollEmployees() {
      this.employeesQuery.limit += 3

      this.showEmployees()
    },
  },
}
</script>
