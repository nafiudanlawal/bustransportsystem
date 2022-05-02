import React, { useEffect } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Navbar from '../Navbar';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';

const AdminLinksPage = (props) => {
  useEffect(() => {
    const pingServer = () => {
      axios.get("http://localhost:5000/api/ping")
        .then(res => {
          if(res.data.message !== "pong"){
            toast.warning("server unavailable");
          }
        }).catch(error => {
          console.log(error);
          toast.warning("server unavailable");
        })
    }
    setInterval(() => {
      pingServer();
    }, 10000);

  }, []);


  return (
    <div className="AdminLinksPage Page">
      <Navbar />
      <div className="Form">
        <div className="FormTitle"></div>

        <Link to='/admin/add-manager' className="LandingLoginBtn">
          Add manager
        </Link>

        <Link to='/admin/add-driver' className="LandingLoginBtn">
          Add driver
        </Link>

        <Link to='/admin/add-route' className="LandingLoginBtn">
          Add route
        </Link>

        <Link to='/admin/add-zone' className="LandingLoginBtn">
          Add zones
        </Link>

        <Link to='/admin/add-bus-stop' className="LandingLoginBtn">
          Add bus stop
        </Link>

        <Link to='/admin/add-bus' className="LandingLoginBtn">
          Add bus
        </Link>

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

export default connect(
  mapStateToProps
)(withRouter(AdminLinksPage));
