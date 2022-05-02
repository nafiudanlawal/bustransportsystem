import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import LandingPage from './components/LandingPage';
import AddManagerPage from './components/AddManagerPage';
import AddDriverPage from './components/AddDriverPage';
import AdminLinksPage from './components/AdminLinksPage';
import PassengerLinksPage from './components/PassengerLinksPage';
import BusstopsPage from './pages/BusstopsPage';
import ZonesPage from './pages/ZonesPage';
import RoutesPage from './pages/RoutesPage';
import BusesPage from './pages/BusesPage';
import RequestRidePage from './components/RequestRidePage';
import MyRidesPage from './components/MyRidesPage';
// Protected route should have token. If not, login.
// const ProtectedRoute = ({ isAllowed, ...props }) => (
//   isAllowed
//     ? <Route {...props} />
//     : <Redirect to="/login" />
// );

// const hasToken = store.getState().user.accessToken;

const Routes = () => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const getUser = () => {
      fetch("http://localhost:5000/auth/login/success", {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true,
        },
      })
        .then((response) => {
          if (response.status === 200) return response.json();
          throw new Error("authentication has been failed!");
        })
        .then((resObject) => {
          setUser(resObject.user);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    getUser();
  }, []);
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={LandingPage} />
        <Route exact path="/login" component={LoginPage} />
        <Route exact path="/register" component={RegisterPage} />
        <Route exact path="/admin" component={AdminLinksPage} />
        {!user &&
          <>
            <Route exact path="/passenger" component={PassengerLinksPage} />
            <Route exact path="/passenger/request-ride" component={RequestRidePage} />
            <Route exact path="/passenger/my-rides" component={MyRidesPage} />
            <Route exact path="/admin/add-manager" component={AddManagerPage} />
            <Route exact path="/admin/add-driver" component={AddDriverPage} />
            <Route exact path="/admin/add-busstop" component={BusstopsPage} />
            <Route exact path="/admin/add-zone" component={ZonesPage} />
            <Route exact path="/admin/add-route" component={RoutesPage} />
            <Route exact path="/admin/add-bus" component={BusesPage} />
          </>
        }
        {/* <ProtectedRoute isAllowed={hasToken} exact path="/" component={App} /> */}
      </Switch>
    </Router>
  );
};

export default Routes
