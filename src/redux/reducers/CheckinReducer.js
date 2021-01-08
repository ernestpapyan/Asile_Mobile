// import {data} from "../fake-datas/UserViewData"
import { FETCH_CHECKIN_REQUEST, FETCH_CHECKIN_SUCCESS, FETCH_CHECKIN_ERROR } from "../constants"
const initialState = {
    loading: false,
    checkin_user: [],
    error: null
}

export default function CheckinReducer(state = initialState, action) {
    switch(action.type) {
        case FETCH_CHECKIN_REQUEST: 
            console.log('fetch request ...')
            return {
                ...state,
                loading: true
            }
        case FETCH_CHECKIN_SUCCESS:
            console.log('fetch success ...')
            return {
                ...state,
                loading: false,
                // userview: [...data]
                checkin_user: action.checkin_user
            }
        case FETCH_CHECKIN_ERROR:
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
