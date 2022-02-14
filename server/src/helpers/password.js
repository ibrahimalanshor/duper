const bcrypt = require('bcrypt')

module.exports = {
  encrpyt: async str => {
    const password = await bcrypt.hash(str, 10)

    return password
  },
  check: async (plain, password) => {
    const match = await bcrypt.compare(plain, password)

    return match
  },
}
