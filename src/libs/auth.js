
export function getToken(key) {
  const TokenKey = key || 'token'
  return JSON.parse(localStorage.getItem(TokenKey))
}

export function setToken(key, token) {
  const TokenKey = key || 'token'
  return localStorage.setItem(TokenKey, JSON.stringify(token))
}

export function removeToken(key) {
  const TokenKey = key || 'token'
  return localStorage.removeItem(TokenKey)
}
