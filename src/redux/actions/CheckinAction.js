/* eslint-disable no-trailing-spaces */
/* eslint-disable prettier/prettier */
import { checkinService, scheduleService } from '../../services/checkin/Checkin';
import { FETCH_CHECKIN_REQUEST, FETCH_CHECKIN_SUCCESS, FETCH_CHECKIN_ERROR} from '../constants'
export const checkinActions = {
    checkin,
};

function checkin(schedule_id, check_in_datetime) {
    return dispatch => {
        dispatch(request());

        checkinService.checkin(schedule_id, check_in_datetime)
            .then(
                
                checkin_user => {
                    dispatch(success(checkin_user));
                    // history.push('/');
                })
            .catch(
                error => {
                    console.log(error)
                    dispatch(failure(error.toString()));
                }
            );
    };

    function request() { return { type: FETCH_CHECKIN_REQUEST } }
    function success(checkin_user) { return { type: FETCH_CHECKIN_SUCCESS, checkin_user } }
    function failure(error) { return { type: FETCH_CHECKIN_ERROR, error } }
}
