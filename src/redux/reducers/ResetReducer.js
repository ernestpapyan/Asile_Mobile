// import {data} from "../fake-datas/AdminData"
import { FETCH_RESET_REQUEST, FETCH_RESET_SUCCESS, FETCH_RESET_ERROR } from "../constants"
const initialState = {
    loading: false,
    reset_user: [],
    error: null
}

export default function ResetReducer(state = initialState, action) {
    switch(action.type) {
        case FETCH_RESET_REQUEST: 
            return {
                ...state,
                loading: true
            }
        case FETCH_RESET_SUCCESS:
            console.log("fetch success..........")
            return {
                ...state,
                loading: false,
                // admin: [...data]
                reset_user: action.reset_user
            }
        case FETCH_RESET_ERROR:
            console.log('fetch error ...')
            return {
                ...state,
                loading: false,
                error: action.error
            }
        default: 
            return state;
    }
}
