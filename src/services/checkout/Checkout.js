import { SERVER_URL } from "../../common/config";
// import ScheduleReducer from '../../redux/reducers/ScheduleReducer'
export const checkoutService = {
    checkout,
};
function checkout(schedule_id, check_out_datetime, upload_picture, notes) {
    let body = {
        schedule_id: schedule_id,
        check_out_datetime: check_in_datetime,
        upload_picture: upload_picture,
        notes: notes
    }
    return new Promise((resolve, reject) => {
        fetch(`${SERVER_URL}checkout`, {
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

