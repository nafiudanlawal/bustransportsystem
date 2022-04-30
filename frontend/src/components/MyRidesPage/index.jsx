import React, { useState, useEffect } from 'react';
import { Link, withRouter } from 'react-router-dom';
import axios from 'axios';
import { connect } from 'react-redux';
import Button from '../Button';
import Navbar from '../Navbar';
import './MyRides.css';

const MyRidesPage = (props) => {
  const [rides, setrides] = useState([]);

  useEffect(() => {
    // remove the current state from local storage
    // so that when a person logs in they dont encounter
    // the previous state which wasnt cleared
    const id = localStorage.getItem('id');
    axios.get(`/api/rides/${id}`)
    .then((res) =>{
      setrides(res.data)
    })
    .catch(err => {
      console.log(err)
    })


  }, []);


  return (
    <div className="MyRidesPage Page">
      <Navbar />
      <div className="Form">
        {/* <div>My Rides</div> */}
        <table>
          <thead>
          <th colspan="4">My Rides</th>
          </thead>
          <thead>
            <th>Pick Up Time</th>
            <th>Departure</th>
            <th>Destination</th>
            <th>Action</th>
          </thead>  
            {rides.map((ride, index) => (
              <tr>
                <td className="Date">{new Date(ride.pickupTime).toDateString()}&nbsp;{new Date(ride.pickupTime).toLocaleTimeString()}</td>
                <td className="Departure">{ride.departureLocation}</td>
                <td className="Dest">{ride.destinationLocation}</td>
                <td>
                <Button
                  label="Cancel"
                  // onClick={handleLogin}
                />
                </td>
              {/* <div className="Ride" key={index}>
                <div className="Date">{new Date(ride.pickupTime).toDateString()}&nbsp;{new Date(ride.pickupTime).toLocaleTimeString()}</div>
                <div className="Departure">{ride.departureLocation}</div>
                <div className="Dest">{ride.destinationLocation}</div>
              </div> */}
              </tr>
            ))}
        </table>    
      </div>
    </div>
  )
}

const mapStateToProps = (state) => (
  { user: state.user }
);

export default connect(
  mapStateToProps
)(withRouter(MyRidesPage));
