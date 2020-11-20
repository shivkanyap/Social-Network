import React from 'react';
import {BrowserRouter,Route,Switch} from 'react-router-dom'
import {Provider} from 'react-redux'

import jwt_decode from 'jwt-decode'
import setAuthToken from './utils/setAuthToken'
import {logoutUser, setCurrentUser} from './action/authAction'


import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Landing from './components/layout/Landing'
import Register from './components/auth/Register'
import Login from './components/auth/Login'
import Dashboard from './components/dashboard/Dashboard'
import CreateProfile from './components/create-profile/CreateProfile'
import EditProfile from './components/edit-profile/EditProfile'

import store from './store/store'
import PrivateRoute from './components/common/PrivateRoute';

import './App.css';
import { clearCurrentProfile } from './action/profileAction';
//check for token
if(localStorage.jwtToken){
  //set auth token header auth
  setAuthToken(localStorage.jwtToken)
  //Decode token and get user info and exp
  const decoded=jwt_decode(localStorage.jwtToken);
  //set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded))

  //Check for expired token
  const currentTime=Date.now()/1000;
  if(decoded.exp<currentTime){
    //Logout user
    store.dispatch(logoutUser());
    //TODO: Clear current profile

    //Claer Profile
    store.dispatch(clearCurrentProfile());
    
    //Redirect to login
    window.location.href='/login'
  }
}

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
      <div className="App">
      <Navbar/>
        <Route  exact path="/" component={Landing}/>
        <div className="container">
          <Route exact path ="/register" component={ Register }/>
          <Route exact path="/login" component={ Login }/>
          <Switch>
          <PrivateRoute exact path="/dashboard" component={Dashboard}/>
          </Switch>
          <Switch>
          <PrivateRoute exact path="/create-profile" component={CreateProfile}/>
          </Switch>
          <Switch>
          <PrivateRoute exact path="/edit-profile" component={EditProfile}/>
          </Switch>
       
        </div>
        <Footer/>
      </div>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
