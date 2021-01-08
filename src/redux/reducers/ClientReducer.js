// import {data} from "../fake-datas/UserViewData"
import { FETCH_CLIENT_REQUEST, FETCH_CLIENT_SUCCESS, FETCH_CLIENT_ERROR } from "../constants"
const initialState = {
    loading: false,
    clients: [],
    error: null
}

export default function ClientReducer(state = initialState, action) {
    switch(action.type) {
        case FETCH_CLIENT_REQUEST: 
            console.log('fetch request ...')
            return {
                ...state,
                loading: true
            }
        case FETCH_CLIENT_SUCCESS:
            console.log('fetch success ...')
            return {
                ...state,
                loading: false,
                // userview: [...data]
                clients: action.clients
            }
        case FETCH_CLIENT_ERROR:
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
