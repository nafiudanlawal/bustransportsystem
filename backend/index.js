const express = require('express');
const app = express();
const cookieSession = require("cookie-session");
const { User } = require('./models/UserModel');
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

//! ----- ROUTES FOR BUS STOPS ------

//! ----- ROUTES FOR ZONES ------

app.listen(process.env.PORT || 5000);

module.exports = {app};