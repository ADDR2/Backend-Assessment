/* 3rd party libraries */
const router = require("express").Router();

/* Local libraries */
const { getAllClients, getAllPolicies } = require(__dirname + "/../utils/requests");

/*
@param req: request object
@param res: response object
function getPoliciesLinked: service that returns list of policies of client
*/
const getPoliciesLinked = (req, res) => {
    const { clientName } = req.params;
    const filteredClients = []; // Constant to save list of clients with given name

     /* Getting list of clients */
    getAllClients().then(
        response => {
            const { clients } = response.data;
            
            /* Iterating through list of clients to get clients with given name */
            clients.forEach(
                client => {
                    if(client.name === clientName && client.role === 'admin') filteredClients.push(client.id);
                }
            );

            /* If no list of clients */
            if(!clients || clients.length < 1 || !filteredClients.length )
                throw new Error("Client not found");
            else // Else chain promise
                return getAllPolicies(); // Getting list of policies
        },
        error => { // In case of error return error and status 500
            res.status(500).send(error);
            console.log(error);
        }
    )
    .then(
        response => {
            const { policies } = response.data;

            /* Filtering policies related to the list of clients with given name */
            const filteredPolicies = policies.filter(
                policy => {
                    return filteredClients.find(clientId => policy.clientId === clientId);
                }
            );

            /* If no list of policies */
            if(!policies || policies.length < 1 || !filteredPolicies.length )
                res.status(202).send("Policies not found");
            else // Else return policies
                res.status(200).send(filteredPolicies);
        },
        error => { // In case of error return error and status 500
            res.status(500).send(error);
            console.log(error);
        }
    );
};

/*
Route of getPoliciesLinked service
Example of use: GET "http://localhost:3000/policy/Manning"
*/
router.get("/:clientName", getPoliciesLinked);

module.exports = router;