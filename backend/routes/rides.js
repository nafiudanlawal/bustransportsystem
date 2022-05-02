const express = require('express');

const router = express.Router();

const rideController = require('../controllers/RideController');

module.exports = () => 
{
    // app.post('/api/rides/request
    router.post('/request', rideController.requestRide);
    // app.get('/api/rides'
    router.get('/', rideController.getRides);
    // app.get('/api/rides/:userID'
    router.get('/:userID', rideController.getSpecificRide);
    // app.post('/api/rides/cancelRide',
    router.post('/cancelRide', rideController.cancelRide);
    return router; 
}