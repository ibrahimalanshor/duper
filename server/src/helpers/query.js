module.exports = {
  value: (key, str) => ({ [key]: str }),
  regex: (key, str) => ({ [key]: { $regex: str, $options: 'i' } }),
  bool: (key, str) => ({ [key]: str.toLowerCase() == 'true' }),
  sort: (sort, order) => ({
    [sort || '_id']: order === 'desc' ? 'desc' : 'asc',
  }),
}
