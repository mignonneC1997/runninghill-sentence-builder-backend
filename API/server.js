const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const { serverPort, dbConnectUrl, collectionTimeout } = require('./config');
const { serverLogger, frontendLogger } = require('./winstonLogger');

const app = express();

app.use(bodyParser.json({
    limit: '500mb',
}));

app.use(bodyParser.urlencoded({
    limit: '500mb',
    extended: true,
}));

app.use(bodyParser.json());

// Enables X-Origin support
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Cache-Control, Authorization, X-Access-Token, accept-version',
        );
    res.setHeader('Access-Control-Allow-Methods', 'PUT, POST, GET, PATCH, OPTIONS, DELETE');
    next();
});

const connectDB = async () => { // connect to MongoDB
    mongoose.connect(dbConnectUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
    }).catch((err) => {
        serverLogger.error(`MongoDB CONNECT ERROR - ${err.message}`);
    });
}

connectDB();

async function getCollectionData(type) { // get data from database
    try {
        // Define the schema for your model
        const wordSchema = new mongoose.Schema({ word: String });
        const collectionModel = mongoose.models[type] || mongoose.model(type, wordSchema);
        await collectionModel.ensureIndexes();
    
        const data = await collectionModel.find({}).maxTimeMS(collectionTimeout);
    
        return data;
        } catch (err) {
            serverLogger.error(`mongoose get data ERROR - ${err.message}`);
            connectDB();
        }
}

async function addCollectionSentenceData(sentence) { // add sentence to database
    try {
        const documentsToInsert = [{ word: sentence }];

        // Check if the 'Sentences' already exists
        if (mongoose.models['Sentences']) {
            const Sentences = mongoose.model('Sentences');
            await Sentences.insertMany(documentsToInsert); // insert into model
        } else {
            // Create model and insert
            const Sentences = mongoose.model('Sentences', new mongoose.Schema({ word: String }));
            await Sentences.insertMany(documentsToInsert);
        }
    } catch (err) {
        serverLogger.error(`mongoose add data ERROR - ${err.message}`);
        connectDB();
    }
}

app.get('/sentences', async (req, res) => { // get sentences from database
    try {
        const data = await getCollectionData('sentences');
        res.status(200).json({
            api: 'success',
            recordset: data
        });
    } catch (err) {
        serverLogger.error(`get sentences ERROR - ${err.message}`);
        connectDB();
        next(err);
    }
});

app.get('/wordTypes', async (req, res, next) => { // get word types from database
    try {
        const data = await getCollectionData('words');
        res.status(200).json({
            response: data,
            api: 'success',
        });
    } catch (err) {
        serverLogger.error(`get wordTypes ERROR - ${err.message}`);
        connectDB();
        next(err);
    }
});

app.get('/getByWordType', async (req, res, next) => { // get words based on word types from database
    try {
        const data = await getCollectionData(req.query.type);
        res.status(200).json({
            recordset: data,
            api: 'success',
        });
    } catch (err) {
        serverLogger.error(`get getByWordType ERROR - ${err.message}`);
        connectDB();
        next(err);
    }
});

app.post('/sentences', (req, res, next) => { // save new sentence into database
    try {
        addCollectionSentenceData(req.body.params);
        res.status(200).json({
            recordset: 'saved',
            api: 'success',
        });
    } catch (err) {
        serverLogger.error(`post sentences ERROR - ${err.message}`);
        next(err);
    }
});

app.post('/frontendLogs', (req, res, next) => { //log frontend errors
    try {
        frontendLogger.error(req.body.message);
        res.status(200).json({
            api: 'success',
            response: 'Error logged',
        });
    } catch (err) {
        serverLogger.error(`post frontendLogs ERROR - ${err.message}`);
        next(err);
    }

});

// Start the Express server
app.listen(serverPort, () => {
    console.log(`Server is running on port ${serverPort}`);
});

