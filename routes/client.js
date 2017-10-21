/* 3rd party libraries */
const router = require("express").Router();
const path = require("path");
const jwt = require('jsonwebtoken');

/* Local libraries */
const { getAllClients, getAllPolicies } = require(path.resolve(__dirname + "/../utils/requests"));
const { errorHandler } = require(path.resolve(__dirname + "/../utils/handlers"));
const { findItem } = require(path.resolve(__dirname + "/../utils/find"));
const { authenticate } = require(path.resolve(__dirname + "/../middlewares/authenticate"));
const { authorize } = require(path.resolve(__dirname + "/../middlewares/authorize"));

/*
@param req: request object
@param res: response object
function getClient: service that returns client with the given id
*/
const getClient = async (req, res) => {
    const { clientId } = req.params;
    try {
        if(!clientId) throw new Error("No id given");

        const response = await getAllClients();
        const clients = errorHandler(response, 'clients');
        const clientFound = findItem(clients, clientId, 'id');

        if(!clientFound)
            res.status(404).send("Client not found");
        else
            res.status(200).send(clientFound);
    } catch (error) {
        res.status(500).send(error.message);
        console.log(error);
    }
};

/*
@param req: request object
@param res: response object
function getClientByName: service that returns list of clients with the given name
*/
const getClientByName = async (req, res) => {
    const { clientName } = req.params;
    try {
        if(!clientName) throw new Error("No name given");

        const response = await getAllClients();
        const clients = errorHandler(response, 'clients');
        
        const filteredClients = clients.filter(
            client => client.name === clientName
        );

        if(filteredClients.length <= 0)
            res.status(404).send("Client not found");
        else
            res.status(200).send(filteredClients);
    } catch (error) {
        res.status(500).send(error.message);
        console.log(error);
    }
};

/*
@param req: request object
@param res: response object
function getClientByPolicy: service that returns client with given policy number
*/
const getClientByPolicy = async (req, res) => {
    const { policyId } = req.params;

    try {
        if(!policyId) throw new Error("No id given");

        let response = await getAllPolicies();
        const policies = errorHandler(response, 'policies');
        const policyFound = findItem(policies, policyId, 'id');

        if(!policyFound)
            throw new Error("Policy not found");

        response = await getAllClients();
        const clients = errorHandler(response, 'clients');
        const clientFound = findItem(clients, policyFound.clientId, 'id');

        if(!clientFound)
            res.status(404).send("No client with given policy");
        else if(clientFound.role !== 'admin')
            res.status(403).send("Access denied");
        else
            res.status(200).send(clientFound);

    } catch (error) {
        res.status(500).send(error.message);
        console.log(error);
    }
};

/*
@param req: request object
@param res: response object
function loginClient: service that returns the client info by email given and a token
to authenticate.
*/
const loginClient = async (req, res) => {
    const { email } = req.body;

    try {
        if(!email) throw new Error("No email given");

        const response = await getAllClients();
        const clients = errorHandler(response, 'clients');
        const clientFound = findItem(clients, email, 'email');

        if(!clientFound)
            res.status(404).send("Client not found");
        else{
            const token = jwt.sign(
                { id: clientFound.id, email: clientFound.email },
                "fd0873462t665&*^%&5623E9<>?"
            ).toString();

            res.status(200).header('x-auth', token).send(clientFound);
        }
    } catch (error) {
        res.status(500).send(error.message);
        console.log(error);
    }
};

/*
Route of getClient service
Example of use:
    method: GET
    url: "http://localhost:3000/client/a0ece5db-cd14-4f21-812f-966633e7be86"
    headers: x-auth
Put the login token on x-auth header
*/
router.get("/:clientId", authenticate, getClient);

/*
Route of getClientByName service
Example of use:
    method: GET
    url: "http://localhost:3000/client/byName/Britney"
    headers: x-auth
Put the login token on x-auth header
*/
router.get("/byName/:clientName", authenticate, getClientByName);

/*
Route of getClientByPolicy service
Example of use:
    method: GET
    url: "http://localhost:3000/client/byPolicy/7b624ed3-00d5-4c1b-9ab8-c265067ef58b"
    headers: x-auth
Put the login token on x-auth header
*/
router.get("/byPolicy/:policyId", authenticate, authorize, getClientByPolicy);

/*
Route of loginClient service
Example of use: 
    method: POST
    url: "http://localhost:3000/client/login"
    body: {
        "email": "whitleyblankenship@quotezart.com"
    }
Example of response:
    headers: {
        "id": "0178914c-548b-4a4c-b918-47d6a391530c",
        "name": "Whitley",
        "email": "whitleyblankenship@quotezart.com",
        "role": "admin"
    }
Use the x-auth header value on the response to authenticate
*/
router.post("/login", loginClient);

module.exports = router;