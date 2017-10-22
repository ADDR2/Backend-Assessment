/* 3rd party libraries */
const path = require("path");
const jwt = require('jsonwebtoken');

/* Local libraries */
const { getAllClients, getAllPolicies } = require(path.resolve(__dirname + "/../utils/requests"));
const { errorHandler } = require(path.resolve(__dirname + "/../utils/handlers"));
const { findItem } = require(path.resolve(__dirname + "/../utils/find"));

/*
@param req: request object
@param res: response object
@param next: next function to continue
function authenticate: middleware that authenticates the user
*/
const authenticate = async (req, res, next) => {
    const token = req.header('x-auth');

    try{
        if(!token) throw new Error("Not logged in");

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const response = await getAllClients();
        const clients = errorHandler(response, 'clients');
        const clientFound = findItem(clients, decoded.id, 'id');

        if(!clientFound)
            res.status(401).send("Invalid login");
        else{
            req.clientRole = clientFound.role;
            next();
        }
    } catch(error) {
        res.status(500).send(error.message);
        console.log(error.message);
    }
};

module.exports = {
    authenticate
};