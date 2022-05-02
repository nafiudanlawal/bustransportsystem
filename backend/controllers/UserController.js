const jwt = require('jsonwebtoken');
const { User } = require('../models/UserModel');
const { log } = require('../config/logInfo');
//! ----- ROUTES FOR USERS ------
// app.post('/api/users/register', async(req, res) => {
const registerUser = async (req, res) => {    
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
        // console.log("NEW ERROR: "+ err +"\n"+req.path);
        log.logData("NEW ERROR: "+ err +"\nEndpoint: "+req.path);
        res.status(201).send({code: 400, message: "User not created", details:err});
    }
}

// app.post('/api/users/login', async(req, res) => {
const userLogin = async (req, res) => {    
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
        log.logData("NEW ERROR: "+ err +"\nEndpoint: "+req.path);
        // console.log("NEW ERROR: "+ error +"\n"+req.path);
        //res.status(500).send({ error: error.message });
        res.status(500).send({code: 500, message: "Token not assigned", details:error});
    }
}

// GET SPECIFIC USER
// app.get('/api/users/:userID', async(req, res) => {
const getSpecificUser = async (req, res) => {    
    try {
        const user = await User.findById(req.params.userID);
        //console.log('See');
        res.status(200).send(user);
    } catch (err) {
        log.logData("NEW ERROR: "+ err +"\nEndpoint: "+req.path);
        res.status(201).send({code: 400, message: "UserID doesn't exists", details:err});
    }
}

module.exports = { registerUser, userLogin, getSpecificUser }