const express = require("express");
const verifyToken = require("../middlewares/authMiddleware");
const Patient = require("../models/user").Patient;

const router = express.Router();


router.get("/me", verifyToken, async(req, res) => {
    try {
        const patient = await Patient.findOne({ _id: req.userID });
        if (!patient) {
            return res.status(404).send({ message: "Patient not found" });
        }
        return res.status(200).send(patient);
    } catch (error) {
        return res.status(400).send({ message: "Error while fetching patient", error: error.message });
    }
});


router.put("/me", verifyToken, async(req, res) => {
    try {
        const patient = await Patient.findOne({ _id: req.userID });
        if (!patient) {
            return res.status(404).send({ message: "Patient not found" });
        }
        if (!patient.account_setup) {
            return res.status(400).send({ message: "Please set up your account first" });
        }
        patient.set(req.body);
        await patient.save();
        return res.status(200).send(patient);
    }
    catch (error) {
        return res.status(400).send({ message: "Error while updating patient", error: error.message });
    }
});

router.put("/account_setup", verifyToken, async(req, res) => {
    try {
        const patient = await Patient.findOne({ _id: req.userID });
        if (!patient) {
            return res.status(404).send({ message: "Patient not found" });
        }
        if (patient.account_setup) {
            return res.status(400).send({ message: "Account already set up" });
        }
        const { username, name, dob, phone } = req.body;
        if (!username || !name || !dob || !phone) {
            return res.status(400).send({ message: "Missing fields" });
        }
        patient.set({ username, name, dob, phone });
        patient.account_setup = true;
        await patient.save();
        return res.status(200).send(patient);
    } catch (error) {
        return res.status(400).send({ message: "Error while setting up account", error: error.message });
    }
});


module.exports = router;