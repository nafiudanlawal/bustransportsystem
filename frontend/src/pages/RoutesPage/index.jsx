import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import './RoutesPage.css';
import axios from 'axios';
import Button from '../../components/Button';
import { trimmed } from '../../helpers';
import InputTextField from '../../components/InputText';

const RoutesPage = (props) => {
  const [route, setRoute] = useState("");
  const [error, setError] = useState('');
  const handleChange = ({ target }) => {
    const { name, value } = target;
    setRoute(value);

    if (error) {
      setError('');
    }

  };
  useEffect(() => {
    // remove the current state from local storage
    // so that when a person logs in they dont encounter
    localStorage.removeItem('state');
  }, []);

  const submit = () => {

    const routeInfo = {
      name: trimmed(route)
    }

    if (!route) {
      setError('Route is required');
      return;
    }

    axios.post('http://localhost:5000/api/routes', routeInfo)             //!   Needs to be changed
      .then(res => {
        if(res.code === 200){
          window.location.href = "/admin";
        }else{
          setError(res.message);
        }
        })
      .catch((err) => {
        setError('Error in adding Route');
        console.log(err);
      });
  };

  return (
    <div className="Page">
      <div className="Form">
        <div className="FormTitle">Add Route</div>

        <InputTextField
          required
          type="text"
          name="route"
          value={route}
          placeholder="Route"
          onChange={handleChange}
        />

        {error && (
          <div className="Error">
            {error}
          </div>
        )}

        <Button
          label="ADD ROUTE"
          onClick={submit}
        />

      </div>
    </div>
  )

}
export default connect()(withRouter(RoutesPage));