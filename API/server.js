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

async function getCollectionData(type) {
    try {
        // Define the schema for your model
        const wordSchema = new mongoose.Schema({ word: String });
        const collectionModel = mongoose.models[type] || mongoose.model(type, wordSchema);
      // Ensure the collection has an index for better performance
        await collectionModel.ensureIndexes();
    
        const data = await collectionModel.find({}).maxTimeMS(60000); // 60 seconds timeout
    
        return data;
        } catch (error) {
            console.error('Error retrieving data:', error);
            logger.error(`mongoose get data ERROR - ${error.message}`);
            connectDB();
        }
}

app.get('/sentences', async (req, res) => {
    try {
        const data = await getCollectionData('sentences');
        res.json({ recordset: data });
    } catch (error) {
        console.error('Error in calling getCollectionData:', error);
        logger.error(`get sentences ERROR - ${error.message}`);
        connectDB();
    }
});

// Start the Express server
app.listen(serverPort, () => {
    console.log(`Server is running on port ${serverPort}`);
});

