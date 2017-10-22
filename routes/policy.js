/* 3rd party libraries */
const router = require("express").Router();
const path = require("path");

/* Local libraries */
const { getAllClients, getAllPolicies } = require(path.resolve(__dirname + "/../utils/requests"));
const { errorHandler } = require(path.resolve(__dirname + "/../utils/handlers"));
const { authenticate } = require(path.resolve(__dirname + "/../middlewares/authenticate"));
const { authorize } = require(path.resolve(__dirname + "/../middlewares/authorize"));

/*
@param req: request object
@param res: response object
function getPoliciesLinked: service that returns list of policies of client
*/
const getPoliciesLinked = async (req, res) => {
    const { clientName } = req.params;
    const filteredClients = [];

    try {
        let response = await getAllClients();
        const clients = errorHandler(response, 'clients');

        clients.forEach(
            client => {
                if(client.name === clientName)
                    filteredClients.push(client.id);
            }
        );

        if(filteredClients.length <= 0)
            throw new Error("No client found");
        
        response = await getAllPolicies();
        const policies = errorHandler(response, 'policies');

        const filteredPolicies = policies.filter(
            policy => filteredClients.find(clientId => policy.clientId === clientId)
        );

        if(filteredPolicies.length <= 0)
            res.status(404).send("Client(s) with no policies");
        else
            res.status(200).send(filteredPolicies);
    } catch (error) {
        res.status(500).send(error.message);
        console.log(error);
    }
};

/*
Route of getPoliciesLinked service
Example of use: GET "http://localhost:3000/policy/Manning"
*/
router.get("/:clientName", authenticate, authorize, getPoliciesLinked);

module.exports = router;