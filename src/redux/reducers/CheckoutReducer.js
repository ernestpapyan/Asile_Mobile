// import {data} from "../fake-datas/UserViewData"
import { FETCH_CHECKOUT_REQUEST, FETCH_CHECKOUT_SUCCESS, FETCH_CHECKOUT_ERROR } from "../constants"
const initialState = {
    loading: false,
    checkout_user: [],
    error: null
}

export default function CheckoutReducer(state = initialState, action) {
    switch(action.type) {
        case FETCH_CHECKOUT_REQUEST: 
            console.log('fetch request ...')
            return {
                ...state,
                loading: true
            }
        case FETCH_CHECKOUT_SUCCESS:
            console.log('fetch success ...')
            return {
                ...state,
                loading: false,
                // userview: [...data]
                checkout_user: action.checkout_user
            }
        case FETCH_CHECKOUT_ERROR:
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
