const express = require("express");
const app = express();

const Model = require("../models/listing.js");
const SampleData = require("./data.js");
const mongoose = require("mongoose");

// ---------- Database Connection ----------
// Connect to MongoDB using Mongoose
async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wonderlust");
}

// Connect and log success or failure
main()
    .then(() => {
        console.log("Database connected successfully.");
    })
    .catch((err) => {
        console.error("Failed to connect to the database.");
        console.error(err);
    });

// ---------- Server Setup ----------
// Set the port for the Express server
app.set("port", 3000);
const port = app.get("port");

// Start the server and log the running port
app.listen(port, () => {
    console.log("Server is running at http://localhost:" + port);
});

// ---------- Routes ----------

// Route to insert sample data into the database
app.get("/initialize", async (req, res) => {
    await Model.insertMany(SampleData.data);
    res.send("Sample data inserted successfully.");
});

// Route to delete all listings from the database
app.get("/delete", (req, res) => {
    Model.deleteMany()
        .then((result) => {
            console.log(result);
        })
        .catch((err) => {
            console.error(err);
        });
    res.send("All listings deleted successfully.");
});

// Route to update all listings by adding a fixed owner ID
app.get("/update", async (req, res) => {
    await Model.updateMany({}, { $set: { owner: '68dbcde683709119a1365b7a' } });
    res.send("All listings updated with owner successfully.");
});

// Route to reset the database and insert fresh sample data
app.get("/setup", async (req, res) => {
    // Delete all existing listings
    await Model.deleteMany({});

    // Insert sample data
    await Model.insertMany(SampleData.data);

    // Update all listings with a fixed owner ID
    await Model.updateMany({}, { $set: { owner: '68dbcde683709119a1365b7a' } });

    await Model.updateMany({}, { $set: { geometry: { type: "Point", coordinates: [-74.0060, 40.7128 ] } } });

    res.send("Database setup completed successfully.");
});