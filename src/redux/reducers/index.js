import { combineReducers } from 'redux'
import LoginReducer from './LoginReducer';
import SignupReducer from './SignupReducer';
import ResetReducer from './ResetReducer';
import ScheduleReducer from './ScheduleReducer';
import AddScheduleReducer from './AddScheduleReducer';
import ClientReducer from './ClientReducer';
import ClientInfoReducer from './ClientInfoReducer';
import CheckinReducer from './CheckinReducer';
import CheckoutReducer from './CheckoutReducer';


const rootReducer = combineReducers({
    //Super Admin Reducer
    login_user: LoginReducer, 
    signup_user: SignupReducer, 
    reset_user: ResetReducer,
    schedules: ScheduleReducer,
    add_schedule: AddScheduleReducer,
    clients: ClientReducer,
    client_info: ClientInfoReducer,
    checkin_user: CheckinReducer,
    checkout_user: CheckoutReducer,
    
})

export default rootReducer;