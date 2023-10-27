const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const { serverPort } = require('./config');

// Start the Express server
app.listen(serverPort, () => {
    console.log(`Server is running on port ${serverPort}`);
});
