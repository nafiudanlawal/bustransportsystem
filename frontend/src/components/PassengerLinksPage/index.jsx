import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Navbar from '../Navbar';

const PassengerLinksPage = (props) => {
  const logout = () => {
    window.open("http://localhost:5000/auth/logout", "_self");
  };
  return (
    <div className="PassengerLinksPage Page">
      <Navbar />
      <div className="Form">
        <div className="FormTitle"></div>

        <Link to='/passenger/request-ride' className="LandingLoginBtn">
          Request ride
        </Link>

        <Link to='/passenger/my-rides' className="LandingLoginBtn">
          View my rides
        </Link>

        <Link onClick={logout} className="LandingLoginBtn">
          Logout
        </Link>

      </div>
    </div>
  )
}

const mapStateToProps = (state) => (
  { user: state.user }
);

export default connect(
  mapStateToProps
)(withRouter(PassengerLinksPage));
