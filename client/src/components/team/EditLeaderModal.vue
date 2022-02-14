<template>
  <form v-on:submit.prevent="store" class="px-4">
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Update Leader</p>
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
            :data="membersFiltered"
            v-on:select="selectLeader"
            v-model="search"
            clearable
            open-on-focus
            append-to-body
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
import { teamApi } from '../../api'

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
      members: [],
      search: '',
      errors: {},
      loading: false,
    }
  },
  computed: {
    membersFiltered() {
      return this.members.filter(
        member =>
          member.name
            .toString()
            .toLowerCase()
            .indexOf(this.search.toLowerCase()) >= 0
      )
    },
  },
  methods: {
    async store() {
      this.loading = true
      this.errors = {}

      try {
        await teamApi.updateLeader(this.teamId, this.employee._id)

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
    async setMembers() {
      try {
        const team = await teamApi.show(this.teamId)

        this.members = team.employees
      } catch (err) {
        console.log(err)
      }
    },
    selectLeader(val) {
      this.employee = val
    },
  },
  mounted() {
    this.setMembers()
  },
}
</script>
