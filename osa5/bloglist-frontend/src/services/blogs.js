import axios from 'axios'

const baseUrl = '/api/blogs'

let token = null

const setToken = (newToken) => {
  token = newToken === null ? null : `Bearer ${newToken}`
}

const authConfig = () => ({
  headers: { Authorization: token }
})

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const create = async (newObject) => {
  const response = await axios.post(baseUrl, newObject, authConfig())
  return response.data
}

const update = async (id, newObject) => {
  const response = await axios.put(`${baseUrl}/${id}`, newObject, authConfig())
  return response.data
}

const remove = async (id) => {
  await axios.delete(`${baseUrl}/${id}`, authConfig())
}

export default { getAll, create, update, remove, setToken }
