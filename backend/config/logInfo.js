const fs = require('fs');
const util = require('util');
////// Date
let dateObject = new Date();
let date = ("0" + dateObject.getDate()).slice(-2);
let month = ("0" + (dateObject.getMonth() + 1)).slice(-2);
let year = dateObject.getFullYear();
let hours = dateObject.getHours();
let minutes = dateObject.getMinutes();
let seconds = dateObject.getSeconds();
const currentDate = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds + " ";

//// Logging to debug.log /////

const logData = (data) => {
    console.log(data);
    fs.appendFile('debug.log', currentDate + data + "\n", (err) => {
        if (err) throw err;
        // console.log('Data logged successfully');
    });
}
//////////

module.exports = logData;