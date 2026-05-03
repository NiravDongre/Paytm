const BASE = 'https://flowpay-9051.onrender.com/api/v1'

function getToken() {
  return localStorage.getItem('fp_access_token')
}

function getRefreshToken() {
  return localStorage.getItem('fp_refresh_token')
}

function saveTokens(accessToken, refreshToken) {
  if (accessToken) localStorage.setItem('fp_access_token', accessToken)
  if (refreshToken) localStorage.setItem('fp_refresh_token', refreshToken)
}

function clearTokens() {
  localStorage.removeItem('fp_access_token')
  localStorage.removeItem('fp_refresh_token')
  localStorage.removeItem('fp_user_id')
}

function genIdemKey() {
  return `idm-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

// Raw fetch — no interception, used internally
async function rawRequest(method, path, body = null, token = null, extraHeaders = {}) {
  const headers = { 'Content-Type': 'application/json', ...extraHeaders }
  if (token) headers['Authorization'] = `Bearer ${token}`
  const opts = { method, headers }
  if (body) opts.body = JSON.stringify(body)
  return fetch(BASE + path, opts)
}

// Try to exchange the refresh token for a new access token.
// Returns true only if we got a valid accessToken back in the response body.
async function tryRefresh() {
  const refreshToken = getRefreshToken()
  if (!refreshToken) return false

  try {
    const res = await rawRequest('POST', '/user/refresh', null, refreshToken)
    const data = await res.json()

    // Your backend returns { status: "fail" } with HTTP 200 on bad token,
    // so we MUST check the body — not just res.ok
    if (data.accessToken && data.refreshToken) {
      saveTokens(data.accessToken, data.refreshToken)
      return true
    }

    // Refresh token is expired or invalid — clear everything
    clearTokens()
    window.location.href = '/signin'
    return false
  } catch {
    clearTokens()
    window.location.href = '/signin'
    return false
  }
}

async function request(method, path, body = null, auth = false, extraHeaders = {}) {
  const token = auth ? getToken() : null
  let res = await rawRequest(method, path, body, token, extraHeaders)

  // On 401 — try once to refresh, then retry the original request
  if (res.status === 401 && auth) {
    const refreshed = await tryRefresh()
    if (refreshed) {
      res = await rawRequest(method, path, body, getToken(), extraHeaders)
    } else {
      return // tryRefresh already redirected to /signin
    }
  }

  const data = await res.json()
  if (!res.ok) throw { status: res.status, message: data.message || 'Something went wrong' }
  return data
}

// ── Auth ──────────────────────────────────────────────────
export async function signup({ UserName, Email, Password }) {
  const data = await request('POST', '/user/signup', { UserName, Email, Password })
  saveTokens(data.accessToken, data.refreshToken)
  if (data.userId) localStorage.setItem('fp_user_id', data.userId)
  return data
}

export async function signin({ UserName, Password }) {
  const data = await request('POST', '/user/signin', { UserName, Password })
  saveTokens(data.accessToken, data.refreshToken)
  return data
}

export async function loggout() {
  try {
    await request('POST', '/user/loggout', null, true)
  } finally {
    clearTokens()
  }
}

// ── User ─────────────────────────────────────────────────
export async function editPassword({ Password }) {
  return request('PUT', '/user/edit', { Password }, true)
}

export async function bulkUsers(filter = '') {
  return request('GET', `/user/bulk${filter ? `?filter=${encodeURIComponent(filter)}` : ''}`, null, true)
}

// ── Account ──────────────────────────────────────────────
export async function getBalance() {
  return request('GET', '/account/balance', null, true)
}

export async function transfer({ to, amount }) {
  const idemKey = genIdemKey()
  return request('POST', '/account/transfer', { to, amount: Number(amount) }, true, {
    'idempotencykey': idemKey,
  })
}

// ── Transactions ─────────────────────────────────────────
export async function getHistory(page = 1, limit = 10) {
  return request('GET', `/transactions/history?page=${page}&limit=${limit}`, null, true)
}

export { getToken, saveTokens, clearTokens }
