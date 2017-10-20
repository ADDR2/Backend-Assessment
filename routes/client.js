/* 3rd party libraries */
const router = require("express").Router();
const path = require("path");

/* Local libraries */
const { getAllClients, getAllPolicies } = require(path.resolve(__dirname + "/../utils/requests"));
const { errorHandler } = require(path.resolve(__dirname + "/../utils/handlers"));
const { findItem } = require(path.resolve(__dirname + "/../utils/find"));

/*
@param req: request object
@param res: response object
function getClient: service that returns client with the given id
*/
const getClient = async (req, res) => {
    const { clientId } = req.params;
    try {
        const response = await getAllClients();
        const clients = errorHandler(response, 'clients');
        const clientFound = findItem(clients, clientId);

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
        let response = await getAllPolicies();
        const policies = errorHandler(response, 'policies');
        const policyFound = findItem(policies, policyId);

        if(!policyFound)
            throw new Error("Policy not found");

        response = await getAllClients();
        const clients = errorHandler(response, 'clients');
        const clientFound = findItem(clients, policyFound.clientId);

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
Route of getClient service
Example of use: GET "http://localhost:3000/client/a0ece5db-cd14-4f21-812f-966633e7be86"
*/
router.get("/:clientId", getClient);

/*
Route of getClientByName service
Example of use: GET "http://localhost:3000/client/byName/Britney"
*/
router.get("/byName/:clientName", getClientByName);

/*
Route of getClientByPolicy service
Example of use: GET "http://localhost:3000/client/byPolicy/7b624ed3-00d5-4c1b-9ab8-c265067ef58b"
*/
router.get("/byPolicy/:policyId", getClientByPolicy);

module.exports = router;