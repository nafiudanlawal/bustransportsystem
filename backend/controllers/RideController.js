const { Ride } = require('../models/RideModel');
const { log } = require('../config/logInfo');
//! ----- ROUTES FOR RIDES ------
// app.post('/api/rides/request', async(req, res) => {
const requestRide = async (req, res) => {
    const ride = new Ride({
        passenger: req.body.passenger,
        pickupTime: req.body.pickupTime,
        departureLocation: req.body.departureLocation,
        destinationLocation: req.body.destinationLocation,
        numberOfSits: req.body.numberOfSits,
        disabledPeople: req.body.disabledPeople,
        cancelled: req.body.cancelled,
    });
    try {
        await ride.save();
        res.status(200).send({ code: 200, message: 'Successfully requested ride.' });

    } catch (err) {
        //res.status(400).send(err);
        //console.log("NEW ERROR: ", err);
        // console.log("NEW ERROR: "+ err +"\n"+req.path);
        logData("NEW ERROR: "+ err +"\nEndpoint: "+req.path);
        res.status(201).send({code: 400, message: "Ride not requested", details:err});
    }
}

// GET ALL RIDE REQUESTS
// app.get('/api/rides', async(req, res) => {
const getRides = async (req, res) => {    
    try {
        const rides = await Ride.find().populate('passenger');
        res.json(rides);

    } catch (err) {
        //console.log("NEW ERROR: ", err);
        //res.json({ message: err });
        // console.log("NEW ERROR: "+ err +"\n"+req.path);
        logData("NEW ERROR: "+ err +"\nEndpoint: "+req.path);
        res.status(201).send({code: 400, message: "No rides", details:err});
    }
}

// GET A SPECIFIC USER'S RIDES
// app.get('/api/rides/:userID', async(req, res) => {
const getSpecificRide = async (req, res) => {    
    try {
        const rides = await Ride.find({ passenger: req.params.userID });
        // console.log(rides);
        res.json(rides);
    } catch (err) {
        //console.log("NEW ERROR: ", err);
        //res.json({ message: err });
        // console.log("NEW ERROR: "+ err +"\n"+req.path);
        logData("NEW ERROR: "+ err +"\nEndpoint: "+req.path);
        res.status(201).send({code: 400, message: "UserID doesn't exist", details:err});
    }
}

// CANCELLING A GIVEN RIDE
// app.post('/api/rides/cancelRide', async(req, res) => {
const cancelRide = async (req, res) => { 
    try {
        // console.log("Ride ID: " + req.body.rid + " Passenger ID: " + req.body.passengerID);
        await Ride.updateOne({_id:req.body.rid}, {$set: {cancelled: 'yes'}});
        const rides = await Ride.find({ passenger: req.body.passengerID });
        // console.log(rides);
        res.json(rides);
    } catch (err) {
        //console.log("NEW ERROR: ", err);
        //res.json({ message: err });
        // console.log("NEW ERROR: "+ err +"\n"+req.path);
        logData("NEW ERROR: "+ err +"\nEndpoint: "+req.path);
        res.status(201).send({code: 400, message: "Error while cancelling the ride, please contact the admin", details:err});
    }
}

module.exports = { requestRide, getRides, getSpecificRide, cancelRide }