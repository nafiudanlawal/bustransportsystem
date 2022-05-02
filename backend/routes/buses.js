const express = require('express');

const router = express.Router();

const busController = require('../controllers/BusController');

module.exports = () => 
{
    // app.post('/api/buses'
    router.post('/', busController.saveBuses);
    // app.get('/api/buses'
    router.get('/', busController.getBuses);
    // app.get('/api/buses/:userID'
    router.get('/:userID', busController.getSpecificBus);
    return router; 
}