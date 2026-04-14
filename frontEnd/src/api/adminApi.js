import http from "./http"

export async function getAdminRecords() {
  const res = await http.get("/habit-records/admin/all")
  return res.data
}

export async function deleteAdminRecord(id) {
  const res = await http.delete(`/habit-records/admin/${id}`)
  return res.data
}

export async function getUsersAdmin() {
  const res = await http.get("/users")
  return res.data
}

export async function updateUserAdmin(id, payload) {
  const res = await http.patch(`/users/${id}`, payload)
  return res.data
}

export async function deleteUserAdmin(id) {
  const res = await http.delete(`/users/${id}`)
  return res.data
}
