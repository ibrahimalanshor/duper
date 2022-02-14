<template>
  <form v-on:submit.prevent="store" class="px-4">
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Add Employee</p>
        <button
          type="button"
          class="delete"
          v-on:click="$emit('close')"
        ></button>
      </header>
      <section class="modal-card-body">
        <b-field grouped>
          <b-field
            label="Name"
            :type="errors.name ? 'is-danger' : ''"
            :message="errors.name ? errors.name.msg : ''"
            expanded
          >
            <b-input placeholder="Name" v-model="employee.name" />
          </b-field>
          <b-field
            label="Email"
            :type="errors.email ? 'is-danger' : ''"
            :message="errors.email ? errors.email.msg : ''"
            expanded
          >
            <b-input
              type="email"
              placeholder="Email"
              v-model="employee.email"
            />
          </b-field>
        </b-field>
        <b-field grouped>
          <b-field
            label="Phone"
            :type="errors.phone ? 'is-danger' : ''"
            :message="errors.phone ? errors.phone.msg : ''"
            expanded
          >
            <b-input
              type="number"
              placeholder="Phone"
              v-model="employee.phone"
            />
          </b-field>
          <b-field
            label="Position"
            :type="errors.position ? 'is-danger' : ''"
            :message="errors.position ? errors.position.msg : ''"
            expanded
          >
            <b-input placeholder="Position" v-model="employee.position" />
          </b-field>
        </b-field>
        <b-field
          label="Password"
          :type="errors.password ? 'is-danger' : ''"
          :message="errors.password ? errors.password.msg : ''"
          expanded
        >
          <b-input
            type="password"
            placeholder="Password"
            v-model="employee.password"
          />
        </b-field>
        <b-field
          label="Gender"
          :type="errors.gender ? 'is-danger' : ''"
          :message="errors.gender ? errors.gender.msg : ''"
        >
          <b-select placeholder="Gender" v-model="employee.gender" expanded>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </b-select>
        </b-field>
        <b-field
          label="Address"
          :type="errors.address ? 'is-danger' : ''"
          :message="errors.address ? errors.address.msg : ''"
        >
          <b-input
            type="textarea"
            placeholder="Address"
            v-model="employee.address"
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
import { employeeApi } from '../../api'

export default {
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      employee: {
        name: this.data.name,
        email: this.data.email,
        phone: this.data.phone,
        address: this.data.address,
        gender: this.data.gender,
        position: this.data.position,
        password: this.data.password,
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
        await employeeApi.update(this.data._id, this.employee)

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
