const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;


// ==========================================
// MIDDLEWARE
// ==========================================

app.use(cors());
app.use(express.json());


// ==========================================
// MONGODB CONNECTION
// ==========================================

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("✅ MongoDB connected successfully!");
    })
    .catch((error) => {
        console.error("❌ MongoDB connection failed:");
        console.error(error.message);
    });


// ==========================================
// SOS DATABASE SCHEMA
// ==========================================

const sosSchema = new mongoose.Schema({

    requestId: {
        type: String,
        required: true,
        unique: true
    },

    userName: {
        type: String,
        default: "Unknown"
    },

    userMobile: {
        type: String,
        default: "Unknown"
    },

    identityVerified: {
        type: Boolean,
        default: false
    },

    location: {
        type: String,
        required: true
    },

    reason: {
        type: String,
        required: true
    },

    people: {
        type: Number,
        required: true
    },

    helpType: {
        type: String,
        required: true
    },

    status: {
        type: String,
        enum: ["PENDING", "RESPONDING", "RESOLVED"],
        default: "PENDING"
    },

    timestamp: {
        type: Date,
        default: Date.now
    }

});


// ==========================================
// SOS MODEL
// ==========================================

const SOS = mongoose.model("SOS", sosSchema);


// ==========================================
// TEST ROUTE
// ==========================================

app.get("/", (req, res) => {

    res.json({
        message: "ADRN backend is running successfully!"
    });

});


// ==========================================
// CREATE SOS
// POST /api/sos
// ==========================================

app.post("/api/sos", async (req, res) => {

    try {

        console.log("\n🚨 NEW SOS REQUEST");
        console.log("----------------------------");

        console.log("Received data:", req.body);


        // Generate temporary request ID

        const requestId =
            "ADRN-" +
            Math.floor(
                100000 +
                Math.random() * 900000
            );


        // Create new SOS record

        const newSOS = new SOS({

            requestId: requestId,

            userName:
                req.body.userName || "Unknown",

            userMobile:
                req.body.userMobile || "Unknown",

            identityVerified:
                req.body.identityVerified || false,

            location:
                req.body.location,

            reason:
                req.body.reason,

            people:
                req.body.people,

            helpType:
                req.body.helpType,

            status:
                "PENDING",

            timestamp:
                req.body.timestamp || new Date()

        });


        // Save SOS to MongoDB

        const savedSOS =
            await newSOS.save();


        console.log("✅ SOS saved to MongoDB");

        console.log(
            "Request ID:",
            savedSOS.requestId
        );

        console.log("----------------------------");


        // Send response

        res.status(201).json({

            success: true,

            message:
                "SOS received and saved successfully!",

            requestId:
                savedSOS.requestId,

            data:
                savedSOS

        });


    } catch (error) {

        console.error(
            "❌ Error saving SOS:"
        );

        console.error(
            error.message
        );


        res.status(500).json({

            success: false,

            message:
                "Failed to save SOS",

            error:
                error.message

        });

    }

});


// ==========================================
// GET ALL SOS REQUESTS
// GET /api/sos
// ==========================================

app.get("/api/sos", async (req, res) => {

    try {

        const sosRequests = await SOS
            .find()
            .sort({ timestamp: -1 });


        res.json({

            success: true,

            count:
                sosRequests.length,

            data:
                sosRequests

        });


    } catch (error) {

        console.error(
            "❌ Error fetching SOS requests:"
        );

        console.error(
            error.message
        );


        res.status(500).json({

            success: false,

            message:
                "Failed to fetch SOS requests"

        });

    }

});


// ==========================================
// GET SINGLE SOS
// GET /api/sos/:requestId
// ==========================================

app.get("/api/sos/:requestId", async (req, res) => {

    try {

        const sosRequest =
            await SOS.findOne({
                requestId:
                    req.params.requestId
            });


        if (!sosRequest) {

            return res.status(404).json({

                success: false,

                message:
                    "SOS request not found"

            });

        }


        res.json({

            success: true,

            data:
                sosRequest

        });


    } catch (error) {

        console.error(
            "❌ Error fetching SOS:"
        );

        console.error(
            error.message
        );


        res.status(500).json({

            success: false,

            message:
                "Failed to fetch SOS request"

        });

    }

});


// ==========================================
// UPDATE SOS STATUS
// PATCH /api/sos/:requestId
// ==========================================

app.patch("/api/sos/:requestId", async (req, res) => {

    try {

        const { status } = req.body;


        // Allowed statuses

        const allowedStatuses = [

            "PENDING",

            "RESPONDING",

            "RESOLVED"

        ];


        // Validate status

        if (!allowedStatuses.includes(status)) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid status. Use PENDING, RESPONDING or RESOLVED."

            });

        }


        // Find and update SOS

        const updatedSOS =
            await SOS.findOneAndUpdate(

                {
                    requestId:
                        req.params.requestId
                },

                {
                    status:
                        status
                },

                {
                    new: true
                }

            );


        // SOS doesn't exist

        if (!updatedSOS) {

            return res.status(404).json({

                success: false,

                message:
                    "SOS request not found"

            });

        }


        console.log(
            `🔄 ${updatedSOS.requestId} status changed to ${status}`
        );


        res.json({

            success: true,

            message:
                "SOS status updated successfully",

            data:
                updatedSOS

        });


    } catch (error) {

        console.error(
            "❌ Error updating SOS status:"
        );

        console.error(
            error.message
        );


        res.status(500).json({

            success: false,

            message:
                "Failed to update SOS status"

        });

    }

});


// ==========================================
// START SERVER
// ==========================================

app.listen(PORT, "0.0.0.0",() => {

    console.log("");

    console.log(
        "🚑 ADRN BACKEND SERVER STARTED"
    );

    console.log(
        `🌐 Server: http://localhost:${PORT}`
    );

    console.log(
        `🚨 SOS API: POST http://localhost:${PORT}/api/sos`
    );

    console.log(
        `📋 SOS LIST: GET http://localhost:${PORT}/api/sos`
    );

    console.log(
        `🔄 STATUS API: PATCH http://localhost:${PORT}/api/sos/:requestId`
    );

    console.log("");

});