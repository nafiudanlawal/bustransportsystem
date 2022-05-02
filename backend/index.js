const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const { User } = require('./models/UserModel');
const { Ride } = require('./models/RideModel');
const { Bus } = require('./models/BusModel');
const { BusRoute } = require('./models/RouteModel');
const { Zone } = require('./models/ZoneModel')
const mongoose = require('mongoose');
const cors = require('cors');
const config = require('./config/config');

// MIDDLEWARES 
app.use(express.json());
app.use(cors());

////// Date
let dateObject = new Date();
let date = ("0" + dateObject.getDate()).slice(-2);
let month = ("0" + (dateObject.getMonth() + 1)).slice(-2);
let year = dateObject.getFullYear();
let hours = dateObject.getHours();
let minutes = dateObject.getMinutes();
let seconds = dateObject.getSeconds();
const currentDate = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds+ " ";


//// Logging to debug.log /////
var fs = require('fs');
var util = require('util');
const { ObjectId } = require('mongodb');
var log_file = fs.createWriteStream(__dirname + '/debug.log', {flags : 'w'});
var log_stdout = process.stdout;

console.log = function(d) { //
  log_file.write(currentDate + util.format(d) + '\n');
  log_stdout.write(currentDate + util.format(d) + '\n');
};
//////////



// CONNECT TO DB
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('DB CONNECTED!'))
.catch(err => {
    console.log(`DB Connection Error: ${err.message}`)
})

app.get('/', (req, res) => {
        //res.status(200).send("Simple bus transport API");
        res.status(200).send({code: 200, message: "Simple bus transport API"});
});

//! ----- ROUTES FOR USERS ------
app.post('/api/users/register', async(req, res) => {
    // VALIDATE BEFORE ADDING USER
    // const { error } = registerValidation(req.body);
    // if (error) return res.status(400).send(error.details[0].message);

    // CHECK IF USER EXISTS
    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist) {
        return res.status(200).send({ code: 400, message: "Email already exists, Go to login page.", details: "Email already exists, Go to login page."});
    }



    // CREATE USER
    const user = new User({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        role: req.body.role,
        phone: req.body.phone,
        email: req.body.email,
        password: req.body.password
    });
    try {
        await user.save();
        res.status(200).send({ user: user._id, firstname: user.firstname, role: user.role, code: 200, message: 'Successfully created user' });

    } catch (err) {
        console.log("NEW ERROR: "+ err +"\n"+req.path);
        res.status(201).send({code: 400, message: "User not created", details:err});
    }
});

app.post('/api/users/login', async(req, res) => {
    // VALIDATE
    // const { error } = loginValidation(req.body);
    // if (error) return res.status(400).send({ code: 400, details: error.details[0].message });

    // CHECK IF EMAIL EXISTS
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(201).send({ code: 400, message: 'Email or Password is invalid' });

    // CHECK IF PASSWORD IS CORRECT
    const validPass = req.body.password === user.password;
    if (!validPass) return res.status(201).send({ code: 400, message: 'Email or Password is invalid' });


    // CREATE AND ASSIGN A TOKEN
    try {
        const token = await jwt.sign({ _id: user._id }, 'skdnvkdsjnvsdkjn');
        res.header('auth-token', token).status(200).send({ user: user._id, firstname: user.firstname, role: user.role, token: token, message: 'successfully Logged in', code: 200 });

    } catch (error) {
        console.log("NEW ERROR: "+ error +"\n"+req.path);
        //res.status(500).send({ error: error.message });
        res.status(500).send({code: 500, message: "Token not assigned", details:error});
    }
});

// GET SPECIFIC USER
app.get('/api/users/:userID', async(req, res) => {
    try {
        const user = await User.findById(req.params.userID);
        //console.log('See');
        res.status(200).send(user);
    } catch (err) {
        //res.json({ message: err });
        //console.log("NEW ERROR: ", err);
        console.log("NEW ERROR: "+ err +"\n"+req.path);
        res.status(201).send({code: 400, message: "UserID doesn't exists", details:err});
    }
});



//! ----- ROUTES FOR RIDES ------
app.post('/api/rides/request', async(req, res) => {
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
        console.log("NEW ERROR: "+ err +"\n"+req.path);
        res.status(201).send({code: 400, message: "Ride not requested", details:err});
    }
});

// GET ALL RIDE REQUESTS
app.get('/api/rides', async(req, res) => {
    try {
        const rides = await Ride.find().populate('passenger');
        res.json(rides);

    } catch (err) {
        //console.log("NEW ERROR: ", err);
        //res.json({ message: err });
        console.log("NEW ERROR: "+ err +"\n"+req.path);
        res.status(201).send({code: 400, message: "No rides", details:err});
    }
});

// GET A SPECIFIC USER'S RIDES
app.get('/api/rides/:userID', async(req, res) => {
    try {
        const rides = await Ride.find({ passenger: req.params.userID });
        // console.log(rides);
        res.json(rides);
    } catch (err) {
        //console.log("NEW ERROR: ", err);
        //res.json({ message: err });
        console.log("NEW ERROR: "+ err +"\n"+req.path);
        res.status(201).send({code: 400, message: "UserID doesn't exist", details:err});
    }
});

// CANCELLING A GIVEN RIDE
app.post('/api/rides/cancelRide', async(req, res) => {
    try {
        // console.log("Ride ID: " + req.body.rid + " Passenger ID: " + req.body.passengerID);
        await Ride.updateOne({_id:req.body.rid}, {$set: {cancelled: 'yes'}});
        const rides = await Ride.find({ passenger: req.body.passengerID });
        // console.log(rides);
        res.json(rides);
    } catch (err) {
        //console.log("NEW ERROR: ", err);
        //res.json({ message: err });
        console.log("NEW ERROR: "+ err +"\n"+req.path);
        res.status(201).send({code: 400, message: "Error while cancelling the ride, please contact the admin", details:err});
    }
});

//! ----- ROUTES FOR BUSES ------
app.post('/api/buses', async(req, res) => {
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
        console.log("NEW ERROR: "+ err +"\n"+req.path);
        res.status(201).send({code: 400, message: "Bus not created", details:err});
    }
})

// GET ALL BUSES
app.get('/api/buses', async(req, res) => {
    try {
        const buses = await Bus.find().populate('driver');
        res.json(buses);

    } catch (err) {
        //console.log("NEW ERROR: ", err);
        //res.json({ message: err });
        console.log("NEW ERROR: "+ err +"\n"+req.path);
        res.status(201).send({code: 400, message: "No buses", details: err});
    }
});

// GET A SPECIFIC DRIVER'S BUSES
app.get('/api/buses/:userID', async(req, res) => {
    try {
        const buses = await Bus.find({ driver: req.params.userID });
        res.json(buses);
    } catch (err) {
        //console.log("NEW ERROR: ", err);
        //res.json({ message: err });
        console.log("NEW ERROR: "+ err +"\n"+req.path);
        res.status(201).send({code: 400, message: "BusID doesn't exists", details: err});
    }
});

//! ----- ROUTES FOR BUS STOPS ------
app.post('/api/routes', async(req, res) => {
    const routes = new BusRoute({
        name: req.body.name,
    });
    try {
        await routes.save();
        res.status(200).send({ code: 200, message: 'Successfully created route' });
 
    } catch (err) {
        //console.log("NEW ERROR: ", err);
        //res.status(400).send(err);
        console.log("NEW ERROR: "+ err +"\n"+req.path);
        res.status(201).send({code: 400, message: "Route not created", details:err});
    }
})
app.get('/api/routes', async(req, res) => {
    try {
        const routes = await BusRoute.find().exec();
        res.json(routes);

    } catch (err) {
        console.log("NEW ERROR: "+ err +"\n"+req.path);
        res.status(201).send({code: 400, message: "No routes", details: err});
    }
});

//! ----- ROUTES FOR ZONES ------
app.post('/api/zones', async(req, res) => {
    const zone = new Zone({
        name:req.body.name,
        route: ObjectId(req.body.route),
    });
    try {
        await zone.save();
        res.status(200).send({ code: 200, message: 'Successfully created a zone.' });

    } catch (err) {
        //console.log("NEW ERROR: ", err);
        //res.status(400).send(err);
        console.log("NEW ERROR: "+ err +"\n"+req.path);
        res.status(201).send({code: 400, message: " Zone not created ", details:err});
    }
}
)
app.get('/api/zones', async(req, res) => {
    try {
        const zones = await Zone.find().exec();
        res.json(zones);

    } catch (err) {
        console.log("NEW ERROR: "+ err +"\n"+req.path);
        res.status(201).send({code: 400, message: "No zones", details: err});
    }
});

//! ----- ROUTES FOR BUSSTOP ------
app.post('/api/busstops', async(req, res) => {
    const busStop = new BusStop({
        name:req.body.name,
        zone: ObjectId(req.body.route),
    });
    try {
        await zone.save();
        res.status(200).send({ code: 200, message: 'Successfully created a bus stop.' });

    } catch (err) {
        //console.log("NEW ERROR: ", err);
        //res.status(400).send(err);
        console.log("NEW ERROR: "+ err +"\n"+req.path);
        res.status(201).send({code: 400, message: " Bus stop not created ", details:err});
    }
}
)
//ROUTES FOR BUS ------

app.post('/api/bus', async(req, res) => {
    const bus = new Bus({
        name:req.body.name,
        zone: ObjectId(req.body.route),
    });
    try {
        await zone.save();
        res.status(200).send({ code: 200, message: 'Successfully created a bus stop.' });

    } catch (err) {
        //console.log("NEW ERROR: ", err);
        //res.status(400).send(err);
        console.log("NEW ERROR: "+ err +"\n"+req.path);
        res.status(201).send({code: 400, message: " Bus stop not created ", details:err});
    }
}
)
app.listen(process.env.PORT || 5000);