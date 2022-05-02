const mongoose = require('mongoose');
//! ----- ROUTE MODEL -----
const RouteSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
}, {
    timestamps: true
});
module.exports = {
    BusRoute: mongoose.model('Route', RouteSchema)
}