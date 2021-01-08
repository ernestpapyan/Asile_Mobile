/* eslint-disable no-trailing-spaces */
/* eslint-disable prettier/prettier */
import { clientService } from '../../services/client/Client';
import { 
    FETCH_CLIENT_REQUEST, 
    FETCH_CLIENT_SUCCESS, 
    FETCH_CLIENT_ERROR,
    FETCH_CLIENTINFO_REQUEST,
    FETCH_CLIENTINFO_SUCCESS,
    FETCH_CLIENTINFO_ERROR
} from '../constants'

export const clientActions = {
    getClients,
    getClientProfileById
};

function getClients(company_id) {
    return dispatch => {
        dispatch(request());

        clientService.getClients(company_id)
            .then(
                
                clients => {
                    dispatch(success(clients));
                    // history.push('/');
                })
            .catch(
                error => {
                    console.log(error)
                    dispatch(failure(error.toString()));
                }
            );
    };

    function request() { return { type: FETCH_CLIENT_REQUEST } }
    function success(clients) { return { type: FETCH_CLIENT_SUCCESS, clients } }
    function failure(error) { return { type: FETCH_CLIENT_ERROR, error } }
}


function getClientProfileById(client_id) {
    return dispatch => {
        dispatch(request());

        clientService.getClientProfileById(client_id)
            .then(
                
                client_info => {
                    dispatch(success(client_info));
                    // history.push('/');
                })
            .catch(
                error => {
                    console.log(error)
                    dispatch(failure(error.toString()));
                }
            );
    };

    function request() { return { type: FETCH_CLIENTINFO_REQUEST } }
    function success(client_info) { return { type: FETCH_CLIENTINFO_SUCCESS, client_info } }
    function failure(error) { return { type: FETCH_CLIENTINFO_ERROR, error } }
}
