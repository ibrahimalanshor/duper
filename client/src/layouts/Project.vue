<template>
  <layout-base>
    <template #header>
      <header v-if="loading">
        <b-skeleton width="120px" height="24px" rounded></b-skeleton>
        <b-skeleton width="360px" height="24px" rounded></b-skeleton>

        <b-skeleton height="200px"></b-skeleton>
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

    <div class="" v-if="!loading && !notfound && project">
      <div class="box p-0">
        <b-tabs>
          <b-tab-item label="Detail">
            <slot name="Detail"></slot>
          </b-tab-item>
          <b-tab-item label="Document">
            <slot name="Document"></slot>
          </b-tab-item>
          <b-tab-item label="Board">
            <slot name="Board"></slot>
          </b-tab-item>
        </b-tabs>
      </div>
    </div>
  </layout-base>
</template>

<script>
import { Base as LayoutBase } from './Base.vue'

export default {
  props: {
    project: {
      type: Object,
      required: true,
    },
    loading: {
      type: Boolean,
      default: true,
    },
    notfound: {
      type: Boolean,
      default: false,
    },
  },
  components: { LayoutBase },
}
</script>
