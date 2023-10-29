const jwt = require('jsonwebtoken');
const {jwtSecret } = require('./config');

// Composes a JWT token
module.exports.getToken = (user_id) => {
    const secret = process.env.JWT_SECRET || jwtSecret;
    return jwt.sign({ useId: user_id }, secret, {
        expiresIn: 86400, // expires in 24 hours
    });
};

// Verifies the JWT token based on secret key and user id
module.exports.verifyToken = (request, response, next) => {
    const token = request.headers['x-access-token'];
    const secret = process.env.JWT_SECRET || jwtSecret;
    if (!token) {
        return response.status(401).send({
        message: 'No token provided.',
        });
    }

    jwt.verify(token, secret, (error, decoded) => {
        if (error) {
        return response.status(401).send({
            message: 'Failed to authenticate token.',
        });
        }
        request.useId = decoded.useId;
        next();
    });
};
