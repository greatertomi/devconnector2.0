import axios from 'axios'
import {setAlert} from "./alert";
import {GET_PROFILE, PROFILE_ERROR} from "./types";
import {baseUrl} from "./baseUrl";

const config = {
  headers: {
    'x-access-token': localStorage.getItem('token')
  }
}

export const getCurrentProfile = () => async dispatch => {
  try {
    const res = await axios.get(`${baseUrl}/api/v1/profiles/me`)
    dispatch({
      type: GET_PROFILE,
      payload: res.data
    })
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: {msg: err.response.statusText, status: err.response.status}
    });
  }
}

export const createProfile = (formData, history, edit = false) => async dispatch => {
  try {
    const res = await axios.post(`${baseUrl}/api/v1/profiles`, formData, config)
    dispatch({
      type: GET_PROFILE,
      payload: res.data
    })
    dispatch(setAlert(edit ? 'Profile Updated' : 'Profile Created', 'success'))
    if (!edit) {
      history.push('/dashboard')
    }
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: PROFILE_ERROR,
      payload: {msg: err.response.statusText, status: err.response.status}
    });
  }
}

