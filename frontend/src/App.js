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
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
