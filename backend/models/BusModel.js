const mongoose = require('mongoose');
//! ----- BUS MODEL -----
const BusSchema = mongoose.Schema({
    plateNumber: {
        type: String,
        required: true,
    },
    available: {
        type: Boolean,
        required: true,
    },
    driver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    issuingDate: {
        type: Date,
        required: true,
    },
}, {
    timestamps: true
});
module.exports = {
    Bus: mongoose.model('Bus', BusSchema)
}