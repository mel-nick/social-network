import axios from 'axios'
import {setAlert} from './alert'
import {
    GET_POSTS, 
    GET_POST, 
    POST_ERROR, 
    UPDATE_LIKES, 
    ADD_POST, 
    ADD_COMMENT,
    REMOVE_COMMENT,
    DELETE_POST
} from './types'

//get posts
export const getPosts = () => async dispatch => {
    try {
        const res = await axios.get('/api/posts');
        dispatch ({
            type: GET_POSTS,
            payload:res.data
        })
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: {
                msg: err.response.statusText,
                status: err.response.status
            }
        })
    }
}


// add like
export const addLike = postId => async dispatch => {
    try {
        const res = await axios.put(`/api/posts/like/${postId}`);
        dispatch ({
            type: UPDATE_LIKES,
            payload: {
                postId, 
                likes:res.data
            }
        })
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: {
                msg: err.response.statusText,
                status: err.response.status
            }
        })
    }
}

// remove like
export const removeLike = postId => async dispatch => {
    try {
        const res = await axios.put(`/api/posts/unlike/${postId}`);
        dispatch ({
            type: UPDATE_LIKES,
            payload: {
                postId, 
                likes:res.data
            }
        })
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: {
                msg: err.response.statusText,
                status: err.response.status
            }
        })
    }
}

// add  post
export const addPost = formData => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    try {
       const res = await axios.post('/api/posts/', formData, config);
        dispatch ({
            type: ADD_POST,
            payload: res.data
        })

        dispatch (setAlert('Post has been successfully created', 'success'))
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: {
                msg: err.response.statusText,
                status: err.response.status
            }
        })
    }
}

//get single post
export const getPost = id => async dispatch => {
    try {
        const res = await axios.get(`/api/posts/${id}`);
        dispatch ({
            type: GET_POST,
            payload:res.data
        })
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: {
                msg: err.response.statusText,
                status: err.response.status
            }
        })
    }
}

// delete single post
export const deletePost = postId => async dispatch => {
    try {
        await axios.delete(`/api/posts/${postId}`);
        dispatch ({
            type: DELETE_POST,
            payload: postId
        })

        dispatch (setAlert('Post has been successfully deleted', 'success'))
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: {
                msg: err.response.statusText,
                status: err.response.status
            }
        })
    }
}

// add  Comment
export const addComment = (postId, formData) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    try {
       const res = await axios.post(`/api/posts/comment/${postId}`, formData, config);
        dispatch ({
            type: ADD_COMMENT,
            payload: res.data
        })

        dispatch (setAlert('Comment has been successfully added', 'success'))
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: {
                msg: err.response.statusText,
                status: err.response.status
            }
        })
    }
}
// delete  Comment
export const deleteComment = (postId, commentId) => async dispatch => {
    try {
       await axios.delete(`/api/posts/comment/${postId}/${commentId}`);
        dispatch ({
            type: REMOVE_COMMENT,
            payload: commentId
        })

        dispatch (setAlert('Comment has been successfully removed', 'danger'))
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: {
                msg: err.response.statusText,
                status: err.response.status
            }
        })
    }
}