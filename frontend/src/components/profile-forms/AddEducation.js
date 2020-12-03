import React, {Fragment, useState} from 'react';
import {Link, withRouter} from "react-router-dom";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {addEducation} from "../../actions/profile";

const AddEducation = ({history, addEducation}) => {
  const [formData, setFormData] = useState({
    school: '',
    degree: '',
    fieldofstudy: '',
    from: '',
    to: '',
    current: false,
    description: ''
  });

  const [toDateDisabled, toggleDisabled] = useState(false)

  const {school, degree, fieldofstudy, from, to, current, description} = formData;

  const onChange = e => setFormData({...formData, [e.target.name]: e.target.value})

  const handleToggle = () => {
    setFormData({...formData, current: !current});
    toggleDisabled(!toDateDisabled)
  }

  const onSubmit = e => {
    e.preventDefault();
    addEducation(formData, history)
  }

  return (
    <Fragment>
      <h1 className="large text-primary">
        Add An Experience
      </h1>
      <p className="lead">
        Add any school or bootcamp you have attended
      </p>
      <small>* = required field</small>
      <form className="form" onSubmit={onSubmit}>
        <div className="form-group">
          <input type="text" placeholder="* School" name="school" required value={school} onChange={e => onChange(e)}/>
        </div>
        <div className="form-group">
          <input type="text" placeholder="* Degree" name="degree" required value={degree} onChange={e => onChange(e)}/>
        </div>
        <div className="form-group">
          <input type="text" placeholder="Field of Study" name="fieldofstudy" value={fieldofstudy} onChange={e => onChange(e)}/>
        </div>
        <div className="form-group">
          <h4>From Date</h4>
          <input type="date" name="from" value={from} onChange={e => onChange(e)}/>
        </div>
        <div className="form-group">
          <p><input type="checkbox" name="current" checked={current} value={current} onChange={handleToggle}/> Current Job</p>
        </div>
        <div className="form-group">
          <h4>To Date</h4>
          <input type="date" name="to" value={to} onChange={e => onChange(e)}
                 disabled={toDateDisabled ? 'disabled': ''}/>
        </div>
        <div className="form-group">
          <textarea
            name="description"
            cols="30"
            rows="5"
            placeholder="Program Description"
            value={description}
            onChange={e => onChange(e)}
          > </textarea>
        </div>
        <input type="submit" className="btn btn-primary my-1"/>
        <Link className="btn btn-light my-1" to="/dashboard">Go Back</Link>
      </form>
    </Fragment>
  );
};

AddEducation.propTypes = {
  addEducation: PropTypes.func.isRequired
};

export default connect(null, {addEducation})(withRouter(AddEducation));
