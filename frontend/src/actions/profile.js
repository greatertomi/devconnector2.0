import axios from 'axios'
import {setAlert} from "./alert";
import {
  ACCOUNT_DELETED,
  CLEAR_PROFILE,
  GET_PROFILE,
  GET_PROFILES, GET_REPOS,
  PROFILE_ERROR,
  UPDATE_PROFILE
} from "./types";
import {baseUrl} from "./baseUrl";

export const getCurrentProfile = () => async dispatch => {
  const config = {
    headers: {
      'x-access-token': localStorage.getItem('token')
    }
  }
  try {
    const res = await axios.get(`${baseUrl}/api/v1/profiles/me`, config)
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

export const getProfiles = () => async dispatch => {
  const config = {
    headers: {
      'x-access-token': localStorage.getItem('token')
    }
  }
  dispatch({type: CLEAR_PROFILE})
  try {
    const res = await axios.get(`${baseUrl}/api/v1/profiles`, config)
    dispatch({
      type: GET_PROFILES,
      payload: res.data
    })
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: {msg: err.response.statusText, status: err.response.status}
    });
  }
}

export const getProfilesById = userId => async dispatch => {
  const config = {
    headers: {
      'x-access-token': localStorage.getItem('token')
    }
  }
  try {
    const res = await axios.get(`${baseUrl}/api/v1/profiles/user/${userId}`, config)
    dispatch({
      type: GET_PROFILE,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: {msg: err.response.statusText, status: err.response.status}
    });
  }
}

export const getGithubRepos = username => async dispatch => {
  const config = {
    headers: {
      'x-access-token': localStorage.getItem('token')
    }
  }
  dispatch({type: CLEAR_PROFILE})
  try {
    const res = await axios.get(`${baseUrl}/api/v1/profiles/github/${username}`, config)
    dispatch({
      type: GET_REPOS,
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
  const config = {
    headers: {
      'x-access-token': localStorage.getItem('token')
    }
  }
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

// Add Experience
export const addExperience = (formData, history) => async dispatch => {
  const config = {
    headers: {
      'x-access-token': localStorage.getItem('token')
    }
  }
  try {
    const res = await axios.put(`${baseUrl}/api/v1/profiles/experience`, formData, config)
    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data
    })
    dispatch(setAlert('Experience Added', 'success'))
    history.push('/dashboard')
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

export const addEducation = (formData, history) => async dispatch => {
  const config = {
    headers: {
      'x-access-token': localStorage.getItem('token')
    }
  }
  try {
    const res = await axios.put(`${baseUrl}/api/v1/profiles/education`, formData, config)
    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data
    })
    dispatch(setAlert('Education Added', 'success'))
    history.push('/dashboard')
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

export const deleteExperience = id => async dispatch => {
  const config = {
    headers: {
      'x-access-token': localStorage.getItem('token')
    }
  }

  try {
    const res = await axios.delete(`${baseUrl}/api/v1/profiles/experience/${id}`, config);
    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data
    })
    dispatch(setAlert('Experience deleted', 'danger'))
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: {msg: err.response.statusText, status: err.response.status}
    });
  }
}

export const deleteEducation = id => async dispatch => {
  const config = {
    headers: {
      'x-access-token': localStorage.getItem('token')
    }
  }

  try {
    const res = await axios.delete(`${baseUrl}/api/v1/profiles/education/${id}`, config);
    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data
    })
    dispatch(setAlert('Experience deleted', 'danger'))
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: {msg: err.response.statusText, status: err.response.status}
    });
  }
}

export const deleteAccount = () => async dispatch => {
  const config = {
    headers: {
      'x-access-token': localStorage.getItem('token')
    }
  }

  if (window.confirm('Are you sure? This can NOT be undone')) {
    try {
      await axios.delete(`${baseUrl}/api/v1/profiles`, config);
      dispatch({type: CLEAR_PROFILE})
      dispatch({type: ACCOUNT_DELETED})
      dispatch(setAlert('Your account has been permanently deleted'))
    } catch (err) {
      dispatch({
        type: PROFILE_ERROR,
        payload: {msg: err.response.statusText, status: err.response.status}
      });
    }
  }
}
