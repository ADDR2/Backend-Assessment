/* 3rd party libraries */
const axios = require("axios");

/* Request to get clients */
const getAllClients = () => {
    /* Returning promise */
    return axios.get('http://www.mocky.io/v2/5808862710000087232b75ac');
};

/* Request to get policies */
const getAllPolicies = () => {
    /* Returning promise */
    return axios.get('http://www.mocky.io/v2/580891a4100000e8242b75c5');
};

module.exports = {
    getAllClients,
    getAllPolicies
};