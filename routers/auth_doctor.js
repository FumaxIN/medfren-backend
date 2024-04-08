const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {Doctor} = require("../models/user");

const router = express.Router();


router.post("/register", async (req, res) => {
    try {
        const {email, password} = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const doctor = new Doctor({email, password: hashedPassword})
        await doctor.save();

        res.status(201).send(doctor);
    } catch (error) {
        res
            .status(400)
            .send({message: "Error while creating user", error: error.message});
    }
});

router.post("/login", async (req, res) => {
    try {
        const {email, password} = req.body;
        const doctor = await Doctor.findOne({email}).populate("user")
        if (!doctor) {
            return res.status(404).send({message: "Not found"});
        }
        const passmatch = await bcrypt.compare(password, doctor.password);
        if (!passmatch) {
            return res.status(400).send({message: "Invalid credentials"});
        }
        const token = jwt.sign({ userID: doctor._id }, process.env.JWT_SECRET, { expiresIn: "30d"
        });
        res.status(200).send({token});
    } catch (error) {
        res
            .status(400)
            .send({message: "Error while logging in", error: error.message});
    }
});

module.exports = router;