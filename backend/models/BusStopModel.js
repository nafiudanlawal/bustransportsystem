const mongoose = require('mongoose');

//! ----- BUS STOP MODEL -----
const BusStopSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    zone: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Zone',
        required: true
    },
}, {
    timestamps: true
});
module.exports = {
    BusStop: mongoose.model('BusStop', BusStopSchema)
}

