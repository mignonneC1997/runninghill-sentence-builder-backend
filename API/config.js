const serverPort = process.env.PORT || 5519;  
const dbConnectUrl = 'mongodb+srv://testUser:testing123@cluster0.3maq2o9.mongodb.net/?retryWrites=true&w=majority';
const collectionTimeout = 60000;

module.exports = {
    serverPort,
    dbConnectUrl,
    collectionTimeout
}