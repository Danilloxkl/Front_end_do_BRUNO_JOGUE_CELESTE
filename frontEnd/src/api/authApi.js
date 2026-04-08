import api from './http'

export function loginRequest(payload) {
  return api.post('/auth/login', payload)
}

export function registerRequest(payload) {
  return api.post('/auth/register', payload)
}
