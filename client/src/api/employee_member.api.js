import http from './http'
import store from '../store'

const url = '/teams'

export default {
  pushEmployee: async (id, employee_id) => {
    const headers = store.getters['auth/headers']
    const res = await http.patch(
      `${url}/${id}/employees`,
      { employee_id },
      { headers }
    )

    return res.data
  },
  removeEmployee: async (id, employee_id) => {
    const headers = store.getters['auth/headers']
    const res = await http.delete(`${url}/${id}/employees/${employee_id}`, {
      headers,
    })

    return res.data
  },
}
