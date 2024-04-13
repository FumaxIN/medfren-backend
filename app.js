const express = require("express");
const app = express();
const cors = require('cors')

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const connectDB = require("./config/database");

const doctorAuthRoutes = require("./routers/auth_doctor");
const doctorRoutes = require("./routers/doctor");

const patientAuthRoutes = require("./routers/auth_patients");
const patientRoutes = require("./routers/patient");

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors())

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Doctor API',
            version: '1.0.0',
            description: 'API documentation for managing doctors',
        },
    },
    apis: ['./routers/user.js'],
};

// Initialize Swagger-jsdoc
const swaggerSpec = swaggerJsdoc(options);

// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));



app.get("/", (req, res) => {
    res.send("Hello World");
});

const start = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error(error);
    }
}

start().then(
    r => console.log(
        'Server started successfully'
    )
).catch(
    e => console.error(
        'Server failed to start')
);  // log will be displayed after await connectDB() is resolved


app.use("/api/v1/auth/doctor", doctorAuthRoutes);
app.use("/api/v1/auth/patient", patientAuthRoutes);

app.use("/api/v1/doctor", doctorRoutes);
app.use("/api/v1/patient", patientRoutes);