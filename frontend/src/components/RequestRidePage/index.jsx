import React, { useState, useEffect } from 'react';
import DateTimePicker from 'react-datetime-picker';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import saveUser from '../../redux/actions/saveUser';
import { ToastContainer, toast } from 'react-toastify';
import Button from '../Button';
import InputTextField from '../InputText';
import Navbar from '../Navbar';
import './index.css';
import 'react-toastify/dist/ReactToastify.css';

const RequestRidePage = (props) => {
  let storage = localStorage.getItem("requestRide");
  if(storage){
    storage = JSON.parse(storage);
  }else{
    storage = {};
  }


  const [details, setDetails] = useState({
    departureLocation: storage.departureLocation ?? '',
    destinationLocation:storage.destinationLocation ?? '',
    numberOfSits:storage.numberOfSits ?? '',
    disabledPeople:storage.disabledPeople ?? '',
  });

  const [error, setError] = useState('');

  const [pickupTime, onDateTimeChange] = useState(new Date());

  const handleChange = ({ target }) => {
    const { name, value } = target;

    if (error) {
      setError('');
    }
    console.log({details});
    setDetails({
      ...details,
      [name]: value
    });
    localStorage.setItem('requestRide', JSON.stringify({...details, [name]: value}));
  };

  const handleRequestRide = (e) => {
    e.preventDefault();
    const {
      departureLocation,
      destinationLocation,
      numberOfSits,
      disabledPeople } = details;

    //* Trim user details

    if (!pickupTime){
      setError('Pickup time is required');
      return;
    }
    if (!departureLocation) {
      setError(error + 'Departure Location is required');
      return;
    }
    if (!destinationLocation) {
      setError(error + 'Destination Location is required');
      return;
    }
    if (!numberOfSits) {
      setError(error + 'Number of sits is required');
      return;
    }
    if (!disabledPeople) {
      setError(error + 'Number of disabled people is required');
      return;
    }

    const rideDetails = { ...details, pickupTime, passenger: localStorage.getItem('id') };

    console.log(rideDetails)

    axios.post('/api/rides/request', rideDetails)
      .then(res => {
        console.log(res.data);

        // props.saveUser(res.data);
        toast.success('Your ride has been requested');
        localStorage.setItem('requestRide', {});
        setTimeout(() => {
          window.location.href = "/passenger/my-rides";
        }, 3000);
      })
      .catch((err) => {
        setError('Process failed.');

        console.log(err);
      });
  };

  const handleCancel = () => {
    setError('Request cancelled');
    setTimeout(() => setError(''), 2000);
  }

  useEffect(() => {
    // remove the current state from local storage
    // so that when a person logs in they dont encounter
    // the previous state which wasnt cleared
    localStorage.removeItem('state');
  }, []);

  return (
    <div className="RequestRidePage Page">
      <Navbar />
      <form className="Form" action='#' method='POST' onSubmit={handleRequestRide}>
        <div className="FormTitle">Request ride</div>

        <DateTimePicker
          onChange={onDateTimeChange}
          value={pickupTime}
        />

        <InputTextField
          required
          type="text"
          name="departureLocation"
          value={details.departureLocation}
          placeholder="Departure Location"
          onChange={handleChange}
        />

        <InputTextField
          required
          type="text"
          name="destinationLocation"
          value={details.destinationLocation}
          placeholder="Destination Location"
          onChange={handleChange}
        />

        <InputTextField
          required
          type="number"
          name="numberOfSits"
          value={details.numberOfSits}
          placeholder="Number of seats"
          onChange={handleChange}
        />

        <InputTextField
          required
          type="number"
          name="disabledPeople"
          value={details.disabledPeople}
          placeholder="Disabled people"
          onChange={handleChange}
        />

        {error && (
          <div className="Error">
            {error}
          </div>
        )}

        <Button
          label="request ride"
          onClick={handleRequestRide}
        />

        <Button
          label="cancel"
          className="CancelBtn"
          onClick={handleCancel}
        />
      </form>
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

RequestRidePage.propTypes = {
  saveUser: PropTypes.func.isRequired
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(RequestRidePage));
