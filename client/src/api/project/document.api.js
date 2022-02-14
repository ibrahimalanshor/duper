import http from '../http'
import store from '../../store'

const url = '/projects'

export default {
  pushDocument: async (id, body) => {
    const headers = store.getters['auth/headers']
    const res = await http.post(`${url}/${id}/docs`, body, {
      headers,
      'Content-Type': 'multipart/form-data',
    })

    return res.data
  },
  updateDocument: async (id, document_id, body) => {
    const headers = store.getters['auth/headers']
    const res = await http.put(`${url}/${id}/docs/${document_id}`, body, {
      headers,
    })

    return res.data
  },
  removeDocument: async (id, document_id) => {
    const headers = store.getters['auth/headers']
    const res = await http.delete(`${url}/${id}/docs/${document_id}`, {
      headers,
    })

    return res.data
  },
}
