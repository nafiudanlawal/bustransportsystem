const express = require("express");
const userRoute = require("./users");
const ridesRoute = require("./rides");
const busesRoute = require("./buses");
const router = express.Router();

router.use(express.json())
router.use("/users", userRoute());
router.use("/rides", ridesRoute());
router.use("/buses", busesRoute());

module.exports = router;