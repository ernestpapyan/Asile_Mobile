// import {data} from "../fake-datas/UserViewData"
import { FETCH_SCHEDULE_REQUEST, FETCH_SCHEDULE_SUCCESS, FETCH_SCHEDULE_ERROR } from "../constants"
const initialState = {
    loading: false,
    schedules: [],
    error: null
}

export default function ScheduleReducer(state = initialState, action) {
    switch(action.type) {
        case FETCH_SCHEDULE_REQUEST: 
            console.log('fetch request ...')
            return {
                ...state,
                loading: true
            }
        case FETCH_SCHEDULE_SUCCESS:
            console.log('fetch success ...')
            return {
                ...state,
                loading: false,
                // userview: [...data]
                schedules: action.schedules
            }
        case FETCH_SCHEDULE_ERROR:
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
