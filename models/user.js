const mongoose = require('mongoose');
const { v4: uuidV4 } = require('uuid');
const SpecialistEnum = require('./enums');
const {Schema} = require("mongoose");


const userSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: uuidV4,
    },
    username: {
        type: String,
        required: false,
        unique: true,
        lowercase: true,
        match: /^[a-zA-Z0-9]+$/,
        // set default to email+last 4 chars of uuid
        default: function () {
            return "username" + this._id.slice(-11);
        },
    },
    name: {
        type: String,
        required: false,
        default: null,
    },
    dob: {
        type: Date,
        required: false,
        default: null,
    },
    email: {
        type: String,
        required: true,
        immutable: true,
    },
    phone: {
        type: String,
        required: false,
        default: null,
    },
    password: {
        type: String,
        required: true,
        immutable: true,
    },
    account_setup: {
        type: Boolean,
        default: false,
        immutable: false,
    },
}, {discriminatorKey: 'kind'});


const doctorSchema = new mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    registration_number: {
        type: String,
        required: false,
        default: null,
    },
    specialization: {
        type: String,
        enum: Object.values(SpecialistEnum),
        required: false,
        default: null,
    },
    total_patients_attended: {
        type: Number,
        default: 0,
        immutable: false,
    },
    clinic_address: {
        type: String,
        required: false,
        default: null,
    },
    featured: {
        type: Boolean,
        default: false,
        immutable: true,
    },
    ratings: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
        immutable: true,
    },
    verified: {
        type: Boolean,
        default: false,
        immutable: false,
    },
});


const patientSchema = new mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    blood_group: {
        type: String,
        required: false,
    },
    weight: {
        type: Number,
        required: false,
    },
    height: {
        type: Number,
        required: false,
    },
    allergies: {
        type: [String],
        default: [],
    },
    emergency_contact: {
        type: String,
        required: false,
    },
    postal_code: {
        type: String,
        required: false,
    },
});


const User = mongoose.model(('User'), userSchema)

const Doctor = User.discriminator('Doctor', doctorSchema);
const Patient = User.discriminator('Patient', patientSchema);

module.exports = { User, Doctor, Patient };
