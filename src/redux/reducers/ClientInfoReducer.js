// import {data} from "../fake-datas/UserViewData"
import { FETCH_CLIENTINFO_REQUEST, FETCH_CLIENTINFO_SUCCESS, FETCH_CLIENTINFO_ERROR } from "../constants"
const initialState = {
    loading: false,
    client_info: [],
    error: null
}

export default function ClientInfoReducer(state = initialState, action) {
    switch(action.type) {
        case FETCH_CLIENTINFO_REQUEST: 
            console.log('fetch request ...')
            return {
                ...state,
                loading: true
            }
        case FETCH_CLIENTINFO_SUCCESS:
            console.log('fetch success ...')
            return {
                ...state,
                loading: false,
                // userview: [...data]
                client_info: action.client_info
            }
        case FETCH_CLIENTINFO_ERROR:
            console.log('fetch error ...')
            return {
                ...state,
                loading: false,
                error: 'error'
            }
        default: 
            return state;
    }
}
