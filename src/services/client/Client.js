import { SERVER_URL } from "../../common/config";
import ScheduleReducer from '../../redux/reducers/ScheduleReducer'
export const clientService = {
    getClient,
    getClientProfileById
};
function getClient(company_id) {
    let body = {
        company_id: company_id
    }
    return new Promise((resolve, reject) => {
        fetch(`${SERVER_URL}getClientByCompanyId`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        })
        .then(res => {
            return res.json()
        })
        .then(res => {
            if(res.error) {
                throw(res.error);
            }
            // return res;
            resolve(res);
        })
        .catch(error => {
            reject(error)
        })
    })
}

function getClientProfileById(client_id) {
    let body = {
        client_id: client_id
    }
    return new Promise((resolve, reject) => {
        fetch(`${SERVER_URL}getClientProfileById`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        })
        .then(res => {
            return res.json()
        })
        .then(res => {
            if(res.error) {
                throw(res.error);
            }
            // return res;
            resolve(res);
        })
        .catch(error => {
            reject(error)
        })
    })
}

