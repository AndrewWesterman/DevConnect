import { SET_ALERT, REMOVE_ALERT } from '../actions/types';

// Alert schema
// {
//     id: 1,
//     msg: 'Please log in',
//     alertType: 'success'
// }

const initialState = [];

export default (state = initialState, action) => {
    const { type, payload } = action;

    switch (type) {
        case SET_ALERT:
            return [...state, payload];
        case REMOVE_ALERT:
            return state.filter((a) => alert.id !== payload);
        default:
            return state;
    }
};
