import api from './http'

export function getHabitRecords() {
  return api.get('/habit-records')
}

export function getHabitRecordById(id) {
  return api.get(`/habit-records/${id}`)
}

export function createHabitRecord(payload) {
  return api.post('/habit-records', payload)
}

export function updateHabitRecord(id, payload) {
  return api.put(`/habit-records/${id}`, payload)
}

export function deleteHabitRecord(id) {
  return api.delete(`/habit-records/${id}`)
}

export function getSummary() {
  return api.get('/habit-records/stats/summary')
}
