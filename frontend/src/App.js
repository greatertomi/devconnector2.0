import React, {useEffect} from "react";
import {BrowserRouter, Route} from 'react-router-dom';
import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import Alert from "./components/layout/Alert";
import './App.css';
import setAuthToken from "./utils/setAuthToken";
import {loadUser} from "./actions/auth";
import store from "./store";
import Dashboard from "./components/dashboard/Dashboard";
import PrivateRoute from "./components/routing/PrivateRoute";
import CreateProfile from "./components/profile-forms/CreateProfile";
import EditProfile from "./components/profile-forms/EditProfile";
import AddExperience from "./components/profile-forms/AddExperience";
import AddEducation from "./components/profile-forms/AddEducation";

if (localStorage.token) {
  setAuthToken()
}

const App = () => {
  useEffect(() => {
    store.dispatch(loadUser())
  }, [])
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <div className='container'>
          <Alert />
          <Route path='/' exact component={Landing}/>
          <Route path='/login' exact component={Login}/>
          <Route path='/register' exact component={Register}/>
          <PrivateRoute path='/dashboard' exact component={Dashboard}/>
          <PrivateRoute path='/create-profile' exact component={CreateProfile}/>
          <PrivateRoute path='/edit-profile' exact component={EditProfile}/>
          <PrivateRoute path='/add-experience' exact component={AddExperience}/>
          <PrivateRoute path='/add-education' exact component={AddEducation}/>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
