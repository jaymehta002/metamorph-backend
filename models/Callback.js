const mongoose = require('mongoose');

const callbackSchema = new mongoose.Schema({
    number: {
        type: String,
        required: true,
    },
    hasBeenCalled: {
        type: Boolean,
        default: false
    }
},
{
    timestamps: true,
});

module.exports = mongoose.model('Callback', callbackSchema);