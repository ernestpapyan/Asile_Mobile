/* eslint-disable no-trailing-spaces */
/* eslint-disable prettier/prettier */
import { checkoutService } from '../../services/checkout/Checkout';
import { FETCH_CHECKOUT_REQUEST, FETCH_CHECKOUT_SUCCESS, FETCH_CHECKOUT_ERROR} from '../constants'
export const checkoutActions = {
    checkout,
};

function checkout(schedule_id, check_out_datetime, upload_picture, note) {
    return dispatch => {
        dispatch(request());

        checkoutService.checkout(schedule_id, check_out_datetime, upload_picture, note)
            .then(
                
                checkout_user => {
                    dispatch(success(checkout_user));
                    // history.push('/');
                })
            .catch(
                error => {
                    console.log(error)
                    dispatch(failure(error.toString()));
                }
            );
    };

    function request() { return { type: FETCH_CHECKOUT_REQUEST } }
    function success(checkout_user) { return { type: FETCH_CHECKOUT_SUCCESS, checkout_user } }
    function failure(error) { return { type: FETCH_CHECKOUT_ERROR, error } }
}
