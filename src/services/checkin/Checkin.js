import { SERVER_URL } from "../../common/config";
// import ScheduleReducer from '../../redux/reducers/ScheduleReducer'
export const checkinService = {
    checkin,
};
function checkin(schedule_id, check_in_datetime) {
    let body = {
        schedule_id: schedule_id,
        check_in_datetime: check_in_datetime
    }
    return new Promise((resolve, reject) => {
        fetch(`${SERVER_URL}checkin`, {
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

