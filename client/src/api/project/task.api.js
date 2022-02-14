import http from '../http'
import store from '../../store'

const url = '/projects'

export default {
  pushTask: async (id, board_id, body) => {
    const headers = store.getters['auth/headers']
    const res = await http.post(`${url}/${id}/boards/${board_id}/tasks`, body, {
      headers,
    })

    return res.data
  },
  updateTask: async (id, board_id, task_id, body) => {
    const headers = store.getters['auth/headers']
    const res = await http.put(
      `${url}/${id}/boards/${board_id}/tasks/${task_id}`,
      body,
      { headers }
    )

    return res.data
  },
  updateStatusTask: async (id, board_id, task_id, status) => {
    const headers = store.getters['auth/headers']
    const res = await http.patch(
      `${url}/${id}/boards/${board_id}/tasks/${task_id}/status`,
      { status },
      { headers }
    )

    return res.data
  },
  updateWorkerTask: async (id, board_id, task_id, worker) => {
    const headers = store.getters['auth/headers']
    const res = await http.patch(
      `${url}/${id}/boards/${board_id}/tasks/${task_id}/worker`,
      { worker },
      { headers }
    )

    return res.data
  },
  removeTask: async (id, board_id, task_id) => {
    const headers = store.getters['auth/headers']
    const res = await http.delete(
      `${url}/${id}/boards/${board_id}/tasks/${task_id}`,
      { headers }
    )

    return res.data
  },
}
