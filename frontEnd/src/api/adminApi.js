import http from "./http"

export const getAllHabitsAdmin = async () => {
  const res = await http.get("/admin/habits")
  return res.data
}

export const createHabitAdmin = async (data) => {
  const res = await http.post("/admin/habits", data)
  return res.data
}

export const updateHabitAdmin = async (id, data) => {
  const res = await http.put(`/admin/habits/${id}`, data)
  return res.data
}

export const deleteHabitAdmin = async (id) => {
  const res = await http.delete(`/admin/habits/${id}`)
  return res.data
}