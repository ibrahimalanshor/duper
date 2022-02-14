<template>
  <div>
    <div class="columns is-gapless mb-3">
      <div class="column is-2-tablet is-2-desktop is-1-widescreen">
        <b>Name</b>
      </div>
      <div class="column is-11">
        {{ project.name }}
      </div>
    </div>
    <div class="columns is-gapless mb-3">
      <div class="column is-2-tablet is-2-desktop is-1-widescreen">
        <b>Team</b>
      </div>
      <div class="column is-11">
        <router-link
          :to="{ name: 'Team Detail', params: { id: project.team._id } }"
          >{{ project.team.name }}</router-link
        >
      </div>
    </div>
    <div class="columns is-gapless mb-3">
      <div class="column is-2-tablet is-2-desktop is-1-widescreen">
        <b>Client</b>
      </div>
      <div class="column is-11">
        {{ project.client ? project.client.name : 'No Client' }}
      </div>
    </div>
    <div class="columns is-gapless mb-3">
      <div class="column is-2-tablet is-2-desktop is-1-widescreen">
        <b>Created</b>
      </div>
      <div class="column is-11">
        {{
          project.createdAt ? new Date(project.createdAt).toDateString() : '-'
        }}
      </div>
    </div>
    <div class="columns is-gapless mb-3">
      <div class="column is-2-tablet is-2-desktop is-1-widescreen">
        <b>Estimate</b>
      </div>
      <div class="column is-11">
        {{ project.estimate ? new Date(project.estimate).toDateString() : '-' }}
      </div>
    </div>
    <div class="columns is-gapless mb-3">
      <div class="column is-2-tablet is-2-desktop is-1-widescreen">
        <b>Budget</b>
      </div>
      <div class="column is-11">
        {{ project.budget ? project.budget : 0 }}
      </div>
    </div>
    <div class="columns is-gapless mb-3">
      <div class="column is-2-tablet is-2-desktop is-1-widescreen">
        <b>Status</b>
      </div>
      <div class="column is-11">
        <b-tag :type="projectStatus(project.status).color">{{
          projectStatus(project.status).text
        }}</b-tag>
      </div>
    </div>

    <hr />

    <div class="content">
      <p>{{ project.description }}</p>
    </div>
  </div>
</template>

<style scoped>
.colon {
  width: 20px;
}
</style>

<script>
export default {
  props: {
    project: {
      type: Object,
      required: true,
    },
  },
  methods: {
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
}
</script>
