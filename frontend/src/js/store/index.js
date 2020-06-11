import {createStore, compose} from 'redux'
import {AUTHENTICATION, LOGOUT} from './actionTypes'

function getAuthFromSessionStorage() {
    const authStatus = sessionStorage.getItem('is_authorized') === 'true' ? true : false;
    return authStatus
}

const initialState = {
    auth: getAuthFromSessionStorage(),
    login: '',
    password: '',
}

function reducer(state = initialState, action) {
    switch (action.type) {
        case AUTHENTICATION:
            return {
                ...state,
                auth: true,
                login: action.payload.login,
                password: action.payload.password
            }
        case LOGOUT:
            return {
                ...state,
                auth: false,
                login: '',
                password: '',
            }
        default:
            return state
    }
}

const store = createStore(reducer, compose(
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
  ))

export default store