const express = require('express');

const router = express.Router();

const userController = require('../controllers/UserController');

module.exports = () => 
{
    // app.post('/api/users/register'
    router.post('/register', userController.registerUser);
    // app.post('/api/users/login'
    router.post('/login', userController.userLogin);
    // app.get('/api/users/:userID'
    router.get('/:userID', userController.getSpecificUser); 
    return router; 
}