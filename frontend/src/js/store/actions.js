import {AUTHENTICATION, LOGOUT} from './actionTypes'

export const auth = (login, password) => ({
    type: AUTHENTICATION,
    payload: {
        login,
        password
    }
})

export const logOut = () => ({
    type: LOGOUT,
})

