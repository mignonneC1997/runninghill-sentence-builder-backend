const serverPort = process.env.PORT || 5519;  
const dbConnectUrl = 'mongodb+srv://testUser:testing123@cluster0.3maq2o9.mongodb.net/?retryWrites=true&w=majority';

module.exports = {
    serverPort,
    dbConnectUrl
}