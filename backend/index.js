const express = require('express');
const app = express();
const cookieSession = require("cookie-session");
const { User } = require('./models/UserModel');
const { Ride } = require('./models/RideModel');
const { Bus } = require('./models/BusModel');
const { BusRoute } = require('./models/RouteModel');
const { Zone } = require('./models/ZoneModel')
const passport = require("passport");
const mongoose = require('mongoose');
const logData = require('./config/logInfo');

const routes = require('./routes');
const cors = require('cors');
const config = require('./config/config');

const CLIENT_URL = "http://localhost:3000/";
let db;
// MIDDLEWARES 
app.use(express.json());
app.use(cors());
app.use(
    cookieSession({ name: "session", keys: ["lama"], maxAge: 24 * 60 * 60 * 100 })
);

app.use(passport.initialize());
app.use(passport.session());


// CONNECT TO DB
if (process.env.NODE_ENV === "test") {
    db = config.testdb;
  }else{
    db = config.mongodb;
  }

mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => logData("Connected to MongoDB"))
    .catch(err => {
        logData("DB Connection error: "+ err.message);
        // console.log(`DB Connection Error: ${err.message}`)
    })

app.get('/', (req, res) => {
    //res.status(200).send("Simple bus transport API");
    res.status(200).send({ code: 200, message: "Simple bus transport API" });
});

app.use("/api", routes);

// OAuth Endpoints
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const GOOGLE_CLIENT_ID = config.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = config.GOOGLE_CLIENT_SECRET;
const GOOGLE_CALLBACK = config.GOOGLE_CALLBACK;

passport.use(new GoogleStrategy(
    {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: GOOGLE_CALLBACK,
    },
    async function (accessToken, refreshToken, profile, done) {
        console.log(profile._json);
        const userExists = await User.findOne({email: profile._json.email}).exec();
        if (!userExists){
            user = new User({
                firstname: profile._json.given_name,
                lastname: profile._json.family_name,
                email: profile._json.email,
                role: "passenger",
                phone: "079",
                password: profile._json.given_name + profile._json.family_name
            });
            user.save();
        }
        done(null, profile);
    }
)
);

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});
app.get("/auth/google", passport.authenticate("google", { scope: ["profile", 'email'] }));

app.get("/auth/google/callback", passport.authenticate("google", {
    successRedirect: CLIENT_URL + "passenger",
    failureRedirect: "/api/users/login/success",
})
);
app.get("/auth/login/success", (req, res) => {
    if (req.user) {
        res.status(200).json({
            success: true,
            message: "successful",
            user: req.user,
            //   cookies: req.cookies
        });
    }
});

app.get("/auth/login/failed", (req, res) => {
    res.status(401).json({
        success: false,
        message: "failure",
    });
});

app.get("/auth/logout", (req, res) => {
    req.logout();
    res.redirect(CLIENT_URL);
});

// PING --> PONG
app.get('/api/ping', async(req, res) => {
    try {
        res.status(200).send({message: "pong"});
        //res.status(200).send("pong");

    } catch (err) {
        console.log("NEW ERROR: "+ err +"\n"+req.path);
        res.status(201).send({code: 400, message: "not pong", details: err});
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
module.exports = {app};