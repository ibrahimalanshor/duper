import http from '../http'
import store from '../../store'

import taskApi from './task.api'

const url = '/projects'

export default {
  pushBoard: async (id, body) => {
    const headers = store.getters['auth/headers']
    const res = await http.post(`${url}/${id}/boards`, body, { headers })

    return res.data
  },
  showBoard: async (id, board_id) => {
    const headers = store.getters['auth/headers']
    const res = await http.get(`${url}/${id}/boards/${board_id}`, { headers })

    return res.data
  },
  updateBoard: async (id, board_id, body) => {
    const headers = store.getters['auth/headers']
    const res = await http.put(`${url}/${id}/boards/${board_id}`, body, {
      headers,
    })

    return res.data
  },
  updateStatusBoard: async (id, board_id, status) => {
    const headers = store.getters['auth/headers']
    const res = await http.patch(
      `${url}/${id}/boards/${board_id}/status`,
      { status },
      { headers }
    )

    return res.data
  },
  removeBoard: async (id, board_id) => {
    const headers = store.getters['auth/headers']
    const res = await http.delete(`${url}/${id}/boards/${board_id}`, {
      headers,
    })

    return res.data
  },
  ...taskApi,
}
