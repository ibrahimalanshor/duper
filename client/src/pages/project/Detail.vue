<template>
  <layout-base>
    <template #header>
      <header v-if="loading" class="mb-5">
        <b-skeleton width="120px" height="24px" rounded></b-skeleton>
      </header>
      <div v-else>
        <header v-if="notfound">
          <h1 class="title">Project Not Found</h1>
          <h2 class="subtitle">The requested project does not exists</h2>

          <b-button
            tag="router-link"
            :to="{ name: 'Project' }"
            type="is-primary"
            label="Back"
            icon-left="arrow-left"
          />
        </header>
        <header class="level mb-5" v-else>
          <div class="level-left">
            <div class="level-item">
              <h1 class="title m-0">{{ project.name }}</h1>
            </div>
          </div>
          <div class="level-right">
            <div class="level-item">
              <b-button
                tag="router-link"
                :to="{ name: 'Project' }"
                icon-left="arrow-left"
                label="Back"
              />
            </div>
          </div>
        </header>
      </div>
    </template>

    <b-skeleton height="200px" v-if="loading" />

    <div class="" v-else>
      <div class="box p-0" v-if="!notfound">
        <b-tabs v-model="tab">
          <b-tab-item label="Detail" value="detail">
            <detail-project-tab :project="project" />
          </b-tab-item>
          <b-tab-item label="Documents" value="document">
            <document-project-tab :project="project" v-on:reload="getTeam" />
          </b-tab-item>
          <b-tab-item label="Board" value="board">
            <board-project-tab :project="project" v-on:reload="getTeam" />
          </b-tab-item>
        </b-tabs>
      </div>
    </div>
  </layout-base>
</template>

<script>
import { Base as LayoutBase } from '../../layouts'
import { projectApi } from '../../api'
import {
  DetailProjectTab,
  DocumentProjectTab,
  BoardProjectTab,
} from '../../components/project/tab'

export default {
  components: {
    LayoutBase,
    DetailProjectTab,
    DocumentProjectTab,
    BoardProjectTab,
  },
  data() {
    return {
      tab: this.$route.query.tab,
      notfound: false,
      loading: true,
      project: {},
      memberLoading: false,
    }
  },
  watch: {
    tab(name) {
      this.$router.push({ query: { tab: name } })

      this.$Progress.finish()
    },
  },
  methods: {
    async getTeam() {
      this.loading = true

      try {
        const project = await projectApi.show(this.$route.params.id)

        this.project = project
      } catch (err) {
        this.notfound = true
      } finally {
        this.loading = false
      }
    },
  },
  mounted() {
    this.getTeam()

    this.$Progress.finish()
  },
}
</script>
