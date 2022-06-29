const jwt = require('jsonwebtoken')
const {JWT_SECRET} = process.env;
module.exports = function (req, res, next) {
    let token = req.header('authorization');
    if (!token) return res.status(400).send('Auth token is required');

    token = token.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        console.log(err)
        return res.status(400).send('Invalid Auth token')
    }
}