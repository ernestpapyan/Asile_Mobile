// import {data} from "../fake-datas/AdminData"
import { FETCH_LOGIN_REQUEST, FETCH_LOGIN_SUCCESS, FETCH_LOGIN_ERROR, LOG_OUT } from "../constants"
const initialState = {
    loading: false,
    login_user: [],
    error: null
}

export default function LoginReducer(state = initialState, action) {
    switch (action.type) {
        case FETCH_LOGIN_REQUEST:
            return {
                ...state,
                loading: true
            }
        case FETCH_LOGIN_SUCCESS:
            return {
                ...state,
                loading: false,
                // admin: [...data]
                login_user: action.login_user
            }
        case FETCH_LOGIN_ERROR:
            console.log('fetch error ...')
            return {
                ...state,
                loading: false,
                error: action.error
            }
        case LOG_OUT:
            return {
                ...state,
                login_user: [],
            }
        default:
            return state;
    }
}
