import { SERVER_URL } from "../../common/config";
import ScheduleReducer from '../../redux/reducers/ScheduleReducer'
export const scheduleService = {
    getSchedule,
    addSchedule,
};
function getSchedule(user_id) {
    let body = {
        user_id: user_id
    }
    return new Promise((resolve, reject) => {
        fetch(`${SERVER_URL}getScheduleByUserId`, {
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
            // return error
        })
    })
}

function addSchedule(data) {
    return new Promise((resolve, reject) => {
        fetch(`${SERVER_URL}createNewSchedule`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
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
            // return error
        })
    })
}
