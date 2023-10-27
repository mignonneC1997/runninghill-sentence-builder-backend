const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const { serverPort, dbConnectUrl } = require('./config');


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

app.get('/wordTypes', async (req, res, next) => {
    try {
        const data = await getCollectionData('words');
        res.status(200).json({
            response: data,
            api: 'success',
        });
    } catch (err) {
        connectDB();
        next(err);
    }
});

app.get('/getByWordType', async (req, res, next) => {
    try {
        console.log(req.query.type);
        const data = await getCollectionData(req.query.type);
        res.json({ recordset: data });
    } catch (err) {
        connectDB();
        next(err);
    }
});


// Start the Express server
app.listen(serverPort, () => {
    console.log(`Server is running on port ${serverPort}`);
});

