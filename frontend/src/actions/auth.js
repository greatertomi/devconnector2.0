import axios from 'axios'
import {setAlert} from "./alert";

import {REGISTER_SUCCESS, REGISTER_FAIL, USER_LOADED, AUTH_ERROR, LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT} from "./types";
import {baseUrl} from "./baseUrl";
import setAuthToken from "../utils/setAuthToken";

export const loadUser = () => async dispatch => {
  /*if (localStorage.token) {
    setAuthToken()
  }*/

  const config = {
    headers: {
      'x-access-token': localStorage.getItem('token')
    }
  }

  try {
    const res = await axios.get(`${baseUrl}/api/v1/auth`, config)
    console.log('login', res.data)
    dispatch({
      type: USER_LOADED,
      payload: res.data
    })
  } catch (err) {
    dispatch({
      type: AUTH_ERROR
    })
  }
}

// Register user
export const register = ({name, email, password}) => async dispatch => {

  const body = {name, email, password}

  try {
    const res = await axios.post(`${baseUrl}/api/v1/users`, body)
    console.log('register', res.data)
    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data
    })
    dispatch(loadUser())
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }
    dispatch({
      type: REGISTER_FAIL
    })
  }
}

// Login user
export const login = ({email, password}) => async dispatch => {

  const body = {email, password}

  try {
    const res = await axios.post(`${baseUrl}/api/v1/auth`, body)
    console.log('register', res.data)
    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data
    })

    dispatch(loadUser())
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }
    dispatch({
      type: LOGIN_FAIL
    })
  }
}

export const logout = () => dispatch => {
  dispatch({type: LOGOUT})
}
