const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Patient } = require("../models/user");

const router = express.Router();


router.post("/register", async (req, res) => {
    try {
        const { email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const patient = new Patient({ email, password: hashedPassword })
        await patient.save();

        res.status(201).send(patient);
    } catch (error) {
        res
            .status(400)
            .send({ message: "Error while creating user", error: error.message });
    }
});


router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const patient = await Patient.findOne({ email }).populate("user")
        if (!patient) {
            return res.status(404).send({ message: "Not found" });
        }
        const passmatch = await bcrypt.compare(password, patient.password);
        if (!passmatch) {
            return res.status(400).send({ message: "Invalid credentials" });
        }
        const token = jwt.sign({ userID: patient._id }, process.env.JWT_SECRET, { expiresIn: "30d" });
        res.status(200).send({ token });
    } catch {
        res
            .status(400)
            .send({ message: "Error while logging in", error: error.message });
    }
});


module.exports = router;