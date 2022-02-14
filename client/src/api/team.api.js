import http from './http'
import store from '../store'

import employeeMember from './employee_member.api'

const url = '/teams'

export default {
  get: async query => {
    const headers = store.getters['auth/headers']
    const res = await http.get(url, { headers, params: query })

    return res.data
  },
  store: async body => {
    const headers = store.getters['auth/headers']
    const res = await http.post(url, body, { headers })

    return res.data
  },
  show: async id => {
    const headers = store.getters['auth/headers']
    const res = await http.get(`${url}/${id}`, { headers })

    return res.data
  },
  update: async (id, body) => {
    const headers = store.getters['auth/headers']
    const res = await http.put(`${url}/${id}`, body, { headers })

    return res.data
  },
  updateStatus: async (id, status) => {
    const headers = store.getters['auth/headers']
    const res = await http.patch(`${url}/${id}/status`, { status }, { headers })

    return res.data
  },
  updateLeader: async (id, leader) => {
    const headers = store.getters['auth/headers']
    const res = await http.patch(
      `${url}/${id}/leader`,
      { employee_id: leader },
      { headers }
    )

    return res.data
  },
  delete: async id => {
    const headers = store.getters['auth/headers']
    const res = await http.delete(`${url}/${id}`, { headers })

    return res.data
  },
  ...employeeMember,
}
