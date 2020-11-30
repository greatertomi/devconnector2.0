import React, {useState} from 'react';
import {Link} from "react-router-dom";

const Login = () => {
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  })

  const {email, password} = loginData

  const onChange = e => setLoginData({...loginData, [e.target.name]: e.target.value})

  const onSubmit = e => {
    e.preventDefault();
    console.log(loginData)
  }

  return (
    <div>
      <div className="alert alert-danger">
        Invalid credentials
      </div>
      <h1 className="large text-primary">Sign In</h1>
      <p className="lead"> Sign into Your Account</p>
      <form className="form" onSubmit={onSubmit}>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            required
            value={email}
            onChange={onChange}
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={onChange}
            required
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Login"/>
      </form>
      <p className="my-1">
        Don't have an account? <Link to='/register'>Sign Up</Link>
      </p>
    </div>
  );
};

export default Login;