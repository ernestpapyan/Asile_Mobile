/* eslint-disable no-trailing-spaces */
/* eslint-disable prettier/prettier */
import { scheduleService } from '../../services/schedule/Schedule';
import { 
    FETCH_SCHEDULE_REQUEST, 
    FETCH_SCHEDULE_SUCCESS, 
    FETCH_SCHEDULE_ERROR,
    FETCH_ADDSCHEDULE_REQUEST,
    FETCH_ADDSCHEDULE_SUCCESS,
    FETCH_ADDSCHEDULE_ERROR
} from '../constants'
export const scheduleActions = {
    getSchedule,
    addSchedule,
};

function getSchedule(user_id) {
    return dispatch => {
        dispatch(request());

        scheduleService.getSchedule(user_id)
            .then(
                
                schedules => {
                    dispatch(success(schedules));
                    // history.push('/');
                })
            .catch(
                error => {
                    console.log(error)
                    dispatch(failure(error.toString()));
                }
            );
    };

    function request() { return { type: FETCH_SCHEDULE_REQUEST } }
    function success(schedules) { return { type: FETCH_SCHEDULE_SUCCESS, schedules } }
    function failure(error) { return { type: FETCH_SCHEDULE_ERROR, error } }
}

function addSchedule(data) {
    return dispatch => {
        dispatch(request());

        scheduleService.addSchedule(data)
            .then(
                
                add_shedule => {
                    dispatch(success(add_shedule));
                    // history.push('/');
                })
            .catch(
                error => {
                    console.log(error)
                    dispatch(failure(error.toString()));
                }
            );
    };

    function request() { return { type: FETCH_ADDSCHEDULE_REQUEST } }
    function success(add_schedule) { return { type: FETCH_ADDSCHEDULE_SUCCESS, add_schedule } }
    function failure(error) { return { type: FETCH_ADDSCHEDULE_ERROR, error } }
}



