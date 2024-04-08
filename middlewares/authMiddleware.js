const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
    const token = req.headers["authorization"]
    if (!token) {
        return res.status(401).send({message: "No token provided"});
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userID = decoded.userID;
        next();
    } catch (error) {
        res.status(403).send({message: "Unauthorized"});
    }
}

module.exports = verifyToken;
