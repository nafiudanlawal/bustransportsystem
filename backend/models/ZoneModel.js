const mongoose = require('mongoose');
//! ----- ZONE MODEL -----
const ZoneSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    route: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Route',
        required: true
    },
}, {
    timestamps: true
});

module.exports = {
    Zone: mongoose.model('Zone', ZoneSchema)
}