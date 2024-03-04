const mongoose = require('mongoose');

const userFormSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    designation: {
        type: String,
        required: true,
    },
    experience:{
        type: String,
        required: true,
    },
    field: {
        type: String,
        required: true,
    },
    linkedin: {
        type: String,
        required: true,
    },
    cities: {
        type: [{
            type: String,
            enum: ['Mumbai', 'Pune', 'Delhi', 'Bengaluru']
        }],
        required: true,
    },
    resume: {
        type: String,
        required: true,
    },
    stayUpdated: {
        type: Boolean,
        default: false,
    },
},
{
    timestamps: true,
});

module.exports = mongoose.model('UserForm', userFormSchema);