import request from 'superagent'
import server from '../../config/server'

export const AUTH_USER_TOKEN = 'DailyLeaf::Token'
export const AUTH_USER_TOKEN_EXPIRY = 'DailyLeaf::Token::Expiry'
export const AUTH_USER = 'DailyLeaf::User'

export const AUTH_ADMIN_TOKEN = 'DailyLeaf::AdminToken'
export const AUTH_ADMIN_TOKEN_EXPIRY = 'DailyLeaf::AdminToken::Expiry'
export const AUTH_ADMIN = 'DailyLeaf::Admin'

const swal = window.swal
const localStorage = window.localStorage

let localUser = localStorage.getItem(AUTH_USER)
let localToken = localStorage.getItem(AUTH_USER_TOKEN)
let localExpiry = localStorage.getItem(AUTH_USER_TOKEN_EXPIRY)

let adminUser = localStorage.getItem(AUTH_ADMIN)
let adminToken = localStorage.getItem(AUTH_ADMIN_TOKEN)
let adminExpiry = localStorage.getItem(AUTH_ADMIN_TOKEN_EXPIRY)

var localLoggedIn = false
if (localUser && localExpiry && new Date() < new Date(localExpiry)) {
  localLoggedIn = (localUser && localToken)
}

var adminLoggedIn = false
if (adminUser && adminExpiry && new Date() < new Date(adminExpiry)) {
  adminLoggedIn = (localUser && adminToken)
}

const initialState = {
  user: JSON.parse(localUser),
  admin: JSON.parse(adminUser),
  token: localToken,
  loggedIn: localLoggedIn,
  adminLoggedIn: adminLoggedIn
}

export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
export const ADMIN_LOGIN_SUCCESS = 'ADMIN_LOGIN_SUCCESS'
export const LOGOUT = 'LOGOUT'
export const ADMIN_LOGOUT = 'ADMIN_LOGOUT'

export const showLogin = () => {
  window.$('#myModal').modal('show')
}

export const signUp = (params) => {
  return (dispatch) => {
    request.post(`${server.url}/register`)
      .send(params)
      .end((err, res) => {
        if (err) {
          swal('Error Logging In')
        } else {
          setupUserAndToken(res.body.user, res.body.token, dispatch)
        }
      })
  }
}

const setupUserAndToken = (user, token, dispatch) => {
  localStorage.setItem(AUTH_USER_TOKEN, token)
  localStorage.setItem(AUTH_USER, JSON.stringify(user))
  let expiryDate = new Date()
  expiryDate.setDate(expiryDate.getDate() + 20)
  // expiryDate.setMinutes(expiryDate.getMinutes() + 1)
  localStorage.setItem(AUTH_USER_TOKEN_EXPIRY, expiryDate)
  dispatch(setUserProfile(user))
  window.location.reload()
}

const setupAdminAndToken = (admin, token, dispatch) => {
  localStorage.setItem(AUTH_ADMIN_TOKEN, token)
  localStorage.setItem(AUTH_ADMIN, JSON.stringify(admin))
  let expiryDate = new Date()
  expiryDate.setDate(expiryDate.getDate() + 20)
  // expiryDate.setMinutes(expiryDate.getMinutes() + 1)
  localStorage.setItem(AUTH_ADMIN_TOKEN_EXPIRY, expiryDate)
  dispatch(setAdminProfile(admin))
  window.location = '/admin'
}

export const login = (params) => {
  return (dispatch) => {
    request.post(`${server.url}/authenticate`)
      .send(params)
      .end((err, res) => {
        if (err) {
          swal('Error Logging In')
        } else {
          setupUserAndToken(res.body.user, res.body.token, dispatch)
        }
      })
  }
}

export const forgotPassword = (params) => {
  return (dispatch) => {
    request.post(`${server.url}/authenticate/admin-reset-password`)
      .send(params)
      .end((err, res) => {
        if (err) {
          swal('Error Resetting Password')
        } else {
          swal('Successfully reset your password, please check your email for further instructions')
        }
      })
  }
}

export const adminLogin = (params) => {
  return (dispatch) => {
    request.post(`${server.url}/authenticate/admin`)
      .send(params)
      .end((err, res) => {
        if (err) {
          swal('Error Logging In')
        } else {
          setupAdminAndToken(res.body.admin, res.body.token, dispatch)
        }
      })
  }
}

export const facebookLogin = (params) => {
  return socialLogin(params, 'facebook')
}

export const googleLogin = (params) => {
  return socialLogin(params, 'google')
}

const socialLogin = (params, type) => {
  return (dispatch) => {
    request.post(`${server.url}/auth/${type}`)
      .send(params)
      .end((err, res) => {
        if (err) {
          swal('Error Logging In')
        } else {
          setupUserAndToken(res.body.user, res.body.token, dispatch)
        }
      })
  }
}

const setUserProfile = (user) => {
  return {
    type: LOGIN_SUCCESS,
    payload: user
  }
}

export const updateAdminProfile = (admin) => {
  localStorage.setItem(AUTH_ADMIN, JSON.stringify(admin))
  return {
    type: ADMIN_LOGIN_SUCCESS,
    payload: admin
  }
}

const setAdminProfile = (admin) => {
  return {
    type: ADMIN_LOGIN_SUCCESS,
    payload: admin
  }
}

export const logout = () => {
  return (dispatch) => {
    localStorage.removeItem(AUTH_USER_TOKEN)
    localStorage.removeItem(AUTH_USER_TOKEN_EXPIRY)
    localStorage.removeItem(AUTH_USER)
    dispatch(logoutEvent())
  }
}

export const adminLogout = () => {
  return (dispatch) => {
    localStorage.removeItem(AUTH_ADMIN)
    localStorage.removeItem(AUTH_ADMIN_TOKEN)
    localStorage.removeItem(AUTH_ADMIN_TOKEN_EXPIRY)
    dispatch(adminLogoutEvent())
    window.location = '/admin/login'
  }
}

const logoutEvent = (user) => {
  return {
    type: LOGOUT
  }
}

const adminLogoutEvent = (user) => {
  return {
    type: ADMIN_LOGOUT
  }
}
const AUTHENTICATION_ACTION_HANDLERS = {
  [LOGIN_SUCCESS]: (state, action) => {
    return ({ ...state, loggedIn: true, user: action.payload })
  },
  [ADMIN_LOGIN_SUCCESS]: (state, action) => {
    return ({ ...state, adminLoggedIn: true, admin: action.payload })
  },
  [LOGOUT]: (state, action) => {
    return ({ ...state, loggedIn: false, user: null })
  },
  [ADMIN_LOGOUT]: (state, action) => {
    return ({ ...state, adminLoggedIn: false, admin: null })
  }
}

export default function zenReducer (state = initialState, action) {
  const handler = AUTHENTICATION_ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
