import axios from 'axios'
import {setAlert} from "./alert";
import {DELETE_POST, GET_POSTS, POST_ERROR, UPDATE_LIKES} from "./types";

export const getPosts = () => async dispatch => {
  try {
    const res = await axios.get('/api/posts');
    dispatch({
      type: GET_POSTS,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      error: {msg: err.response.statusText, status: err.response.status}
    });
  }
}

// Add Like
export const addLike = postId => async dispatch => {
  try {
    const res = await axios.put(`/api/posts/like/${postId}`);
    dispatch({
      type: UPDATE_LIKES,
      payload: {postId, likes: res.data}
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      error: {msg: err.response.statusText, status: err.response.status}
    });
  }
}

export const removeLike = postId => async dispatch => {
  try {
    const res = await axios.put(`/api/posts/unlike/${postId}`);
    dispatch({
      type: UPDATE_LIKES,
      payload: {postId, likes: res.data}
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      error: {msg: err.response.statusText, status: err.response.status}
    });
  }
}

export const deletePost = postId => async dispatch => {
  try {
    await axios.delete(`/api/posts/unlike/${postId}`);
    dispatch({
      type: DELETE_POST,
      payload: postId
    });
    dispatch(setAlert('Post removed', 'success'))
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      error: {msg: err.response.statusText, status: err.response.status}
    });
  }
}
