const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const { serverPort, dbConnectUrl } = require('./config');

const connectDB = async () => {
    mongoose.connect(dbConnectUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
    }).catch((err) => {
        logger.error(`MongoDB CONNECT ERROR - ${err.message}`);
    });
}

connectDB();

// Start the Express server
app.listen(serverPort, () => {
    console.log(`Server is running on port ${serverPort}`);
});

