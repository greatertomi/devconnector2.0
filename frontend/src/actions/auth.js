import axios from 'axios'
import {setAlert} from "./alert";

import {REGISTER_SUCCESS, REGISTER_FAIL} from "./types";
import {baseUrl} from "./baseUrl";

// Register user
export const register = ({name, email, password}) => async dispatch => {

  const body = {name, email, password}

  try {
    const res = await axios.post(`${baseUrl}/api/v1/users`, body)
    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data
    })
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
