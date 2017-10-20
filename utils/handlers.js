/*
@param response: response object resulting from a request
@param responseKey: key to be extracted from the response object
function errorHandler: returns the key requested from a response object or
throws error
*/
const errorHandler = (response, responseKey) => {
    if(!response || !("data" in response))
        throw new Error("No data available");

    const key = response.data[responseKey];

    if(!key || key.length <= 0)
        throw new Error("Empty list");
    
    return key;
};

module.exports = {
    errorHandler
};