const express = require("express");
const verifyToken = require("../middlewares/authMiddleware");
const Doctor = require("../models/user").Doctor;
const {verifyDoctor} = require("../utils/doctorVerification");

const router = express.Router();

router.get("/me", verifyToken, async (req, res) => {
    try {
        const doctor = await Doctor.findOne({_id: req.userID});
        if (!doctor) {
            return res.status(404).send({message: "Doctor not found"});
        }
        res.status(200).send(doctor);
    } catch (error) {
        res.status(400).send({message: "Error while fetching doctor", error: error.message});
    }
});

router.put("/me", verifyToken, async (req, res) => {
    try {
        const doctor = await Doctor.findOne({_id: req.userID});
        if (!doctor) {
            return res.status(404).send({message: "Doctor not found"});
        }
        if (!doctor.account_setup) {
            return res.status(400).send({message: "Please set up your account first"});
        }
        doctor.set(req.body);
        await doctor.save();
        return res.status(200).send(doctor);
    } catch (error) {
        res.status(400).send({message: "Error while updating doctor", error: error.message});
    }
});

router.put("/account_setup", verifyToken, async (req, res) => {
    try {
        const doctor = await Doctor.findOne({_id: req.userID});
        if (!doctor) {
            return res.status(404).send({message: "Doctor not found"});
        }
        if (doctor.account_setup) {
            return res.status(400).send({message: "Account already set up"});
        }
        const {username, name, dob, phone} = req.body;
        if (!username || !name || !dob || !phone) {
            return res.status(400).send({message: "Missing fields"});
        }
        if (await Doctor .findOne({ username })) {
            return res.status(400).send({message: "Username already exists"});
        }

        doctor.set({username, name, dob, phone});
        doctor.account_setup = true;
        await doctor.save();
        res.status(200).send(doctor);
    } catch (error) {
        res.status(400).send({message: "Error while setting up account", error: error.message});
    }
})

router.put("/verify", verifyToken, async (req, res) => {
    try{
        const doctor = await Doctor.findOne({_id: req.userID});
        if (!doctor) {
            return res.status(404).send({message: "Doctor not found"});
        }
        if (!doctor.account_setup) {
            return res.status(400).send({message: "Account not set up"});
        }
        if (doctor.verified) {
            return res.status(400).send({message: "Doctor already verified"});
        }

        const {nmc_number, dmc_number} = req.body;
        if (!nmc_number && !dmc_number) {
            return res.status(400).send({message: "Missing fields"});
        }
        const verified = await verifyDoctor(nmc_number, dmc_number, doctor);
        if (!verified) {
            return res.status(400).send({message: "Verification failed"});
        }
        doctor.verified = true;
        doctor.registration_number = nmc_number || dmc_number;
        await doctor.save();
        res.status(200).send({message: "Verification successful"});
    } catch (error) {
        res.status(400).send({message: "Error while verifying doctor", error: error.message});
    }
})


module.exports = router;