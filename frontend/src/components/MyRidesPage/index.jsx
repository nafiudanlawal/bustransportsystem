import React, { useState, useEffect } from 'react';
import { Link, withRouter } from 'react-router-dom';
import axios from 'axios';
import { connect } from 'react-redux';
import Button from '../Button';
import Navbar from '../Navbar';
import './MyRides.css';

const MyRidesPage = (props) => {
  const [rides, setrides] = useState([]);

  const handleCancel = (rideID) => {
    // console.log("Ride ID: " + rideID);
    const rideDetails = { passengerID: localStorage.getItem('id'), rid: rideID};
    // alert("Ride ID: " + rideDetails.rid + " Passenger ID: " + rideDetails.passengerID);
    axios.post('/api/rides/cancelRide', rideDetails)
      .then(res => {
        setrides(res.data)                
      })
      .catch((err) => {
        console.log(err);
      });
  };
  
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
      <div>
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
            {rides.map((ride, index) => {
             if (new Date(ride.pickupTime) > Date.now() && ride.cancelled == 'no')
             return (<tr>
             <td className="Date">{new Date(ride.pickupTime).toDateString()}&nbsp;{new Date(ride.pickupTime).toLocaleTimeString()}</td>
             <td className="Departure">{ride.departureLocation}</td>
             <td className="Dest">{ride.destinationLocation}</td>
             <td>
             <Button
               label="Cancel"
               onClick={() => handleCancel(ride._id)}
             />
             </td>
            </tr>)
            else
            {
              if (ride.cancelled == 'yes') {
                return (
                <tbody>
                <tr>
                  <td className="Date">{new Date(ride.pickupTime).toDateString()}&nbsp;{new Date(ride.pickupTime).toLocaleTimeString()}</td>
                  <td className="Departure">{ride.departureLocation}</td>
                  <td className="Dest">{ride.destinationLocation}</td>
                  <td>Cancelled</td>
                 </tr>
                 </tbody>
                 )
              } else {
                return (
                <tbody>
                <tr>
                  <td className="Date">{new Date(ride.pickupTime).toDateString()}&nbsp;{new Date(ride.pickupTime).toLocaleTimeString()}</td>
                  <td className="Departure">{ride.departureLocation}</td>
                  <td className="Dest">{ride.destinationLocation}</td>
                  <td>Done</td>
                 </tr>
                 </tbody>
                 )
              }
            } 
            }  
            )}
        </table>    
      </div>
    </div>
  )
}
// {rides.map((ride, index) => (
//   <tr>
//     <td className="Date">{new Date(ride.pickupTime).toDateString()}&nbsp;{new Date(ride.pickupTime).toLocaleTimeString()}</td>
//     <td className="Departure">{ride.departureLocation}</td>
//     <td className="Dest">{ride.destinationLocation}</td>
//     <td>
//     <Button
//       label="Cancel"
//       // onClick={handleLogin}
//     />
//     </td>
//   </tr>
// ))}
const mapStateToProps = (state) => (
  { user: state.user }
);

export default connect(
  mapStateToProps
)(withRouter(MyRidesPage));
