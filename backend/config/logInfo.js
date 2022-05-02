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
var log_file = fs.createWriteStream(__dirname + '/debug.log', {flags : 'w'});
var log_stdout = process.stdout;

const logData = (data) => {
    log_file.write(currentDate + util.format(data) + '\n');
    log_stdout.write(currentDate + util.format(data) + '\n');
}
// console.log = function(d) { //
//   log_file.write(currentDate + util.format(d) + '\n');
//   log_stdout.write(currentDate + util.format(d) + '\n');
// };
//////////

module.exports = { logData }