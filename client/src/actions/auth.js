import axios from 'axios';
import { setAlert } from './alert';
import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    AUTH_ERROR,
    USER_LOADED,
    LOGOUT,
} from './types';
import setAuthToken from '../utils/setAuthToken';

// Load User
export const loadUser = () => async (dispatch) => {
    // Put the token in default headers
    if (localStorage.token) {
        setAuthToken(localStorage.token);
    }

    try {
        // Attempt to pull a user from with our token
        const res = await axios.get('/api/auth');
        // Dispatch the new user
        dispatch({
            type: USER_LOADED,
            payload: res.data,
        });
    } catch (err) {
        // Dispatch an error
        dispatch({
            type: AUTH_ERROR,
        });
    }
};

// Register User
export const register = ({ name, email, password }) => async (dispatch) => {
    // Create our request headers and body
    const config = {
        headers: {
            'Content-Type': 'application/json',
        },
    };
    const body = JSON.stringify({ name, email, password });

    try {
        // Attempt to register the user
        const res = await axios.post('/api/users', body, config);

        // Dispatch user token
        dispatch({
            type: REGISTER_SUCCESS,
            payload: res.data,
        });

        // Dispatch load user
        dispatch(loadUser());
    } catch (err) {
        // Create alerts for any errors
        const errors = err.response.data.errors;
        if (errors) {
            errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
        }

        // Dispatch failed
        dispatch({
            type: REGISTER_FAIL,
        });
    }
};

// Log In User
export const login = ({ email, password }) => async (dispatch) => {
    // Create our request headers and body
    const config = {
        headers: {
            'Content-Type': 'application/json',
        },
    };
    const body = JSON.stringify({ email, password });

    try {
        // Attempt to register the user
        const res = await axios.post('/api/auth', body, config);

        // Dispatch user token
        dispatch({
            type: LOGIN_SUCCESS,
            payload: res.data,
        });

        // Dispatch load user
        dispatch(loadUser());
    } catch (err) {
        // Create alerts for any errors
        const errors = err.response.data.errors;
        if (errors) {
            errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
        }

        // Dispatch failed
        dispatch({
            type: LOGIN_FAIL,
        });
    }
};

// Logout / Clear profile
export const logout = () => (dispatch) => {
    dispatch({ type: LOGOUT });
};
