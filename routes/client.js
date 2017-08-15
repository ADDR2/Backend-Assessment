/* 3rd party libraries */
const router = require("express").Router();

/* Local libraries */
const { getAllClients, getAllPolicies } = require(__dirname + "/../utils/requests");

/*
@param list: array of items (object array)
@param itemId: id of item Ex: "a0ece5db-cd14-4f21-812f-966633e7be86"
function findItem: returns the object with the given id or undefined
*/
const findItem = (list, itemId) => {
    let index = 0;

    while(index < list.length && list[index].id !== itemId)
        index++;

    return (!list || list.length < 1 || index >= list.length) ? undefined: list[index];
};

/*
@param req: request object
@param res: response object
function getClient: service that returns client with the given id
*/
const getClient = (req, res) => {

    const { clientId } = req.params;

    /* Getting list of clients */
    getAllClients().then(
        response => {
            const { clients } = response.data;

            const clientFound = findItem(clients, clientId);

            if(!clientFound) // If client not found or no list of clients
                res.status(202).send("Client not found");
            else // Else return client pbject
                res.status(200).send(clientFound);

        }, error => { // In case of error return error and status 500
            res.status(500).send(error);
            console.log(error);
        }
    );
};

/*
@param req: request object
@param res: response object
function getClientByName: service that returns list of clients with the given name
*/
const getClientByName = (req, res) => {
    const { clientName } = req.params;

    /* Getting list of clients */
    getAllClients().then(
        response => {
            const { clients } = response.data;
            
            /* Filtering clients by given name */
            const filteredClients = clients.filter(
                client => {
                    return client.name === clientName;
                }
            );

            /* If client not found or no list of clients */
            if(!clients || clients.length < 1 || !filteredClients.length )
                res.status(202).send("Client not found");
            else // Else return clients with given name
                res.status(200).send(filteredClients);

        }, error => { // In case of error return error and status 500
            res.status(500).send(error);
            console.log(error);
        }
    );
};

/*
@param req: request object
@param res: response object
function getClientByPolicy: service that returns client with given policy number
*/
const getClientByPolicy = (req, res) => {
    const { policyId } = req.params;
    let policyFound; // Variable to save policy with given id

    /* Getting list of policies */
    getAllPolicies().then(
        response => {
            const { policies } = response.data;

            policyFound = findItem(policies, policyId);

            if(!policyFound) // If policy not found or no list of policies
                throw new Error("Policy not found");
            else // Else chain promise with list of clients
                return getAllClients();
        },
        error => { // In case of error return error and status 500
            res.status(500).send(error);
            console.log(error);
        }
    )
    .then(
        response => {
            const { clients } = response.data;

            const clientFound = findItem(clients, policyFound.clientId);

            if(!clientFound) // If client not found or no list of clients
                res.status(202).send("Client not found");
            else if(clientFound.role !== 'admin') // Else if user is not admin
                res.status(403).send("Access denied");
            else // Else return client with given policy number
                res.status(200).send(clientFound);

        }, error => { // In case of error return error and status 500
            res.status(500).send(error);
            console.log(error);
        }
    );
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