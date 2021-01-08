// import {data} from "../fake-datas/UserViewData"
import { FETCH_ADDSCHEDULE_REQUEST, FETCH_ADDSCHEDULE_SUCCESS, FETCH_ADDSCHEDULE_ERROR } from "../constants"
const initialState = {
    loading: false,
    add_schedule: [],
    error: null
}

export default function AddScheduleReducer(state = initialState, action) {
    switch(action.type) {
        case FETCH_ADDSCHEDULE_REQUEST: 
            console.log('fetch request ...')
            return {
                ...state,
                loading: true
            }
        case FETCH_ADDSCHEDULE_SUCCESS:
            console.log('fetch success ...')
            return {
                ...state,
                loading: false,
                // userview: [...data]
                add_schedule: action.add_schedule
            }
        case FETCH_ADDSCHEDULE_ERROR:
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
