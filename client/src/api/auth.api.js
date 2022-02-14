import http from './http'

export default {
  loginAdmin: async body => {
    const res = await http.post('/auth/admin', body)

    return res.data
  },
  loginEmployee: async body => {
    const res = await http.post('/auth/employee', body)

    return res.data
  },
}
