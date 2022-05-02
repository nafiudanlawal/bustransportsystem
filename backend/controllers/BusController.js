const { Bus } = require('../models/BusModel');
const logData = require('../config/logInfo');
//! ----- ROUTES FOR BUSES ------
// app.post('/api/buses', async(req, res) => {
const saveBuses = async (req, res) => {
    const bus = new Bus({
        plateNumber: req.body.plateNumber,
        available: req.body.available,
        driver: req.body.driver,
        issuingDate: req.body.issuingDate,
    });
    try {
        await bus.save();
        res.status(200).send({ code: 200, message: 'Successfully created bus.' });

    } catch (err) {
        //console.log("NEW ERROR: ", err);
        //res.status(400).send(err);
        // console.log("NEW ERROR: "+ err +"\n"+req.path);
        logData("NEW ERROR: "+ err +"\nEndpoint: "+req.path);
        res.status(201).send({code: 400, message: "Bus not created", details:err});
    }
}

// GET ALL BUSES
// app.get('/api/buses', async(req, res) => {
const getBuses = async (req, res) => {    
    try {
        const buses = await Bus.find().populate('driver');
        res.json(buses);

    } catch (err) {
        //console.log("NEW ERROR: ", err);
        //res.json({ message: err });
        // console.log("NEW ERROR: "+ err +"\n"+req.path);
        logData("NEW ERROR: "+ err +"\nEndpoint: "+req.path);
        res.status(201).send({code: 400, message: "No buses", details: err});
    }
}

// GET A SPECIFIC DRIVER'S BUSES
// app.get('/api/buses/:userID', async(req, res) => {
const getSpecificBus = async (res, req) => {    
    try {
        const buses = await Bus.find({ driver: req.params.userID });
        res.json(buses);
    } catch (err) {
        //console.log("NEW ERROR: ", err);
        //res.json({ message: err });
        // console.log("NEW ERROR: "+ err +"\n"+req.path);
        logData("NEW ERROR: "+ err +"\nEndpoint: "+req.path);
        res.status(201).send({code: 400, message: "BusID doesn't exists", details: err});
    }
}

module.exports = { saveBuses, getBuses, getSpecificBus }