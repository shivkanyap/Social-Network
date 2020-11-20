// const { TEST_DISPATCH } = require("./types")
import axios from 'axios'
import jwt_decode from 'jwt-decode'
import setAuthToken from '../utils/setAuthToken'
import {GET_ERRORS,SET_CURRENT_USER} from './types';

//Register User
export const registeruser= (userData,history)=>dispatch=>{
    axios.post('/api/users/register',userData)
        .then((res)=>history.push('/login'))
        .catch((err)=>
        dispatch({
            type:GET_ERRORS,
            payload:err.response.data
        })
        )
};
export const loginUser=userData=>dispatch=>{
    axios.post('/api/users/login',userData)
    .then((res)=>{
        //Save to the local Storage
        const {token}=res.data
        //set token to the ls
        localStorage.setItem('jwtToken',token)
        //set token to auth header
        setAuthToken(token);
        //Decode token to get user data
        const decoded=jwt_decode(token)
        //Set current user
        dispatch(setCurrentUser(decoded))

    })
    .catch((err)=>
    dispatch({
        type:GET_ERRORS,
        payload:err.response
    }))
}
//Set logged in user
export const setCurrentUser=(decoded)=>{
    return{
        type:SET_CURRENT_USER,
        payload:decoded
    }
}

//Log out user
export const logoutUser=()=>dispatch=>{
    //Remove token from localStorage
    localStorage.removeItem('jwtToken')
    //Remove auth header for future requests
    setAuthToken(false)
    //Set current user to {} which will set isAuthenticated to false
    dispatch(setCurrentUser({}))
}