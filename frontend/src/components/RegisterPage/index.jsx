import React, { useState, useEffect } from 'react';
import { Link, withRouter } from 'react-router-dom';
import axios from 'axios';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import saveUser from '../../redux/actions/saveUser';
import { isValidEmail, isValidUsername, trimmed } from '../../helpers';
import Button from '../Button';
import InputTextField from '../InputText';
import './RegisterPage.css';
import { toast, ToastContainer } from 'react-toastify';

const RegisterPage = (props) => {
  const [user, setUser] = useState({
    firstname: '',
    lastname: '',
    role: '',
    email: '',
    phone: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = ({ target }) => {
    const { name, value } = target;

    if (error) {
      setError('');
    }

    setUser({
      ...user,
      [name]: value
    });
  };

  const handleRegister = () => {
    const { firstname, lastname, role, email, phone, password } = user;

    //* Trim user details
    const userInfo = {
      firstname,
      lastname,
      role,
      email: trimmed(email),
      phone,
      password: trimmed(password)
    }

    if (!userInfo.firstname) {
      setError('First name is required');
      return;
    }
    if (!userInfo.lastname) {
      setError('Last name is required');
      return;
    }
    if (!userInfo.role) {
      setError('Role is required');
      return;
    }
    if (!userInfo.email) {
      setError('Email is required');
      return;
    }
    if (!userInfo.phone) {
      setError('Phone number is required');
      return;
    }
    if (!userInfo.password) {
      setError('Password is required');
      return;
    }
    if (!isValidUsername(userInfo.name)) {
      setError('Name can only contain letters and numbers');
      return;
    }

    if (!isValidEmail(userInfo.email)) {
      setError('Invalid email address');
      return;
    }

    axios.post('/api/users/register/', user)
      .then(res => {
        if (res.data.code === 200) {
          props.saveUser(res.data);
          //! Once they've registered, redirect them to the tutorial page

          toast.success('Registration successful');
          setTimeout(() => {
            window.location.href = "/passenger";
          }, 3000);
        } else if (res.data.code === 400) {
          console.log(res)
          setError(res.data.message);
        } else {
          setError('Registration failed.');
        }

      })
      .catch((err) => {
        setError('Registration failed.');

        console.log(err);
      });
  };

  useEffect(() => {
    // remove the current state from local storage
    // so that when a person logs in they dont encounter
    // the previous state which wasn't cleared
    localStorage.removeItem('state');
  }, []);

  return (
    <div className="RegisterPage Page">
      <div className="Form">
        <div className="FormTitle">sign up</div>

        <InputTextField
          required
          type="text"
          name="firstname"
          value={user.firstname}
          placeholder="First Name"
          onChange={handleChange}
        />

        <InputTextField
          required
          type="text"
          name="lastname"
          value={user.lastname}
          placeholder="Last Name"
          onChange={handleChange}
        />

        <InputTextField
          required
          type="text"
          name="role"
          value={user.role}
          placeholder="Role"
          onChange={handleChange}
        />

        <InputTextField
          required
          type="email"
          name="email"
          value={user.email}
          placeholder="Email"
          onChange={handleChange}
        />

        <InputTextField
          required
          type="number"
          name="phone"
          value={user.phone}
          placeholder="Phone"
          onChange={handleChange}
        />

        <InputTextField
          required
          type="password"
          name="password"
          value={user.password}
          placeholder="Password"
          onChange={handleChange}
        />

        {error && (
          <div className="Error">
            {error}
          </div>
        )}

        <Button
          label="register"
          onClick={handleRegister}
        />

        <div className="AlternativeLink">
          Have an account? <Link to='/login'>Login here</Link>
        </div>
      </div>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  )
}

const mapStateToProps = (state) => (
  { user: state.user }
);

const mapDispatchToProps = {
  saveUser
};

RegisterPage.propTypes = {
  saveUser: PropTypes.func.isRequired
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(RegisterPage));
