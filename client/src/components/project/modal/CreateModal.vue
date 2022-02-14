<template>
  <form v-on:submit.prevent="store" class="px-4">
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Add Project</p>
        <button
          type="button"
          class="delete"
          v-on:click="$emit('close')"
        ></button>
      </header>
      <section class="modal-card-body">
        <b-field
          label="Name"
          :type="errors.name ? 'is-danger' : ''"
          :message="errors.name ? errors.name.msg : ''"
          expanded
        >
          <b-input placeholder="Name" v-model="project.name" />
        </b-field>
        <b-field grouped>
          <b-field
            label="Client"
            :type="errors.client ? 'is-danger' : ''"
            :message="errors.client ? errors.client.msg : 'Optional'"
            expanded
          >
            <b-autocomplete
              placeholder="Client"
              field="name"
              :data="searchClient.data"
              :loading="searchClient.searching"
              v-on:focus="showClients"
              v-on:select="selectClient"
              v-on:input="findClient"
              v-on:infinite-scroll="scrollClients"
              clearable
              open-on-focus
              append-to-body
              check-infinite-scroll
            >
              <template #empty>No Results Found</template>
            </b-autocomplete>
          </b-field>
          <b-field
            label="Team"
            :type="errors.team ? 'is-danger' : ''"
            :message="errors.team ? errors.team.msg : ''"
            expanded
          >
            <b-autocomplete
              placeholder="Team"
              field="name"
              :data="searchTeam.data"
              :loading="searchTeam.searching"
              v-on:focus="showTeams"
              v-on:select="selectTeam"
              v-on:input="findTeam"
              v-on:infinite-scroll="scrollTeams"
              clearable
              open-on-focus
              append-to-body
              check-infinite-scroll
            >
              <template #empty>No Results Found</template>
            </b-autocomplete>
          </b-field>
        </b-field>
        <b-field grouped>
          <b-field
            label="Estimate"
            :type="errors.estimate ? 'is-danger' : ''"
            :message="errors.estimate ? errors.estimate.msg : ''"
            expanded
          >
            <b-datepicker placeholder="Estimate" v-model="project.estimate" />
          </b-field>
          <b-field
            label="Budget"
            :type="errors.budget ? 'is-danger' : ''"
            :message="errors.budget ? errors.budget.msg : ''"
            expanded
          >
            <b-input
              type="number"
              placeholder="Budget"
              v-model="project.budget"
            />
          </b-field>
        </b-field>
        <b-field
          label="Description"
          :type="errors.description ? 'is-danger' : ''"
          :message="errors.description ? errors.description.msg : ''"
          expanded
        >
          <b-input
            type="textarea"
            placeholder="Description"
            v-model="project.description"
          />
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
import { projectApi, clientApi, teamApi } from '../../../api'

export default {
  data() {
    return {
      project: {
        name: '',
        client: '',
        team: '',
        estimate: new Date(),
        budget: '',
        description: '',
      },
      searchClient: {
        data: [],
        query: {
          name: '',
          sort: 'name',
          status: 'true',
          limit: 10,
        },
        searching: false,
      },
      searchTeam: {
        data: [],
        query: {
          sort: 'name',
          status: 'true',
          limit: 10,
        },
        searching: false,
      },
      errors: {},
      loading: false,
    }
  },
  methods: {
    async store() {
      this.loading = true
      this.errors = {}

      try {
        await projectApi.store(this.project)

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
    async showClients() {
      this.searchClient.searching = true

      try {
        const clients = await clientApi.get(this.searchClient.query)

        this.searchClient.data = clients.docs
      } catch (err) {
        console.log(err)
      } finally {
        this.searchClient.searching = false
      }
    },
    selectClient(client) {
      this.project.client = client?._id
    },
    findClient(val) {
      this.searchClient.query.name = val

      this.showClients()
    },
    scrollClients() {
      this.searchClient.query.limit += 3

      this.showClients()
    },
    async showTeams() {
      this.searchTeam.searching = true

      try {
        const teams = await teamApi.get(this.searchTeam.query)

        this.searchTeam.data = teams.docs
      } catch (err) {
        console.log(err)
      } finally {
        this.searchTeam.searching = false
      }
    },
    selectTeam(team) {
      this.project.team = team?._id
    },
    findTeam(val) {
      this.searchTeam.query.name = val

      this.showTeams()
    },
    scrollTeams() {
      this.searchTeam.query.limit += 3

      this.showTeams()
    },
  },
}
</script>
