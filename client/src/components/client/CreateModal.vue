<template>
  <form v-on:submit.prevent="store" class="px-4">
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Add Client</p>
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
          <b-input placeholder="Name" v-model="client.name" />
        </b-field>
        <b-field grouped>
          <b-field
            label="Email"
            :type="errors.email ? 'is-danger' : ''"
            :message="errors.email ? errors.email.msg : ''"
            expanded
          >
            <b-input type="email" placeholder="Email" v-model="client.email" />
          </b-field>
          <b-field
            label="Phone"
            :type="errors.phone ? 'is-danger' : ''"
            :message="errors.phone ? errors.phone.msg : ''"
            expanded
          >
            <b-input type="number" placeholder="Phone" v-model="client.phone" />
          </b-field>
        </b-field>
        <b-field
          label="Address"
          :type="errors.address ? 'is-danger' : ''"
          :message="errors.address ? errors.address.msg : ''"
        >
          <b-input
            type="textarea"
            placeholder="Address"
            v-model="client.address"
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
import { clientApi } from '../../api'

export default {
  data() {
    return {
      client: {
        name: '',
        email: '',
        phone: '',
        address: '',
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
        await clientApi.store(this.client)

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
  },
}
</script>
