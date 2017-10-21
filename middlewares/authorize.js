/*
@param req: request object
@param res: response object
@param next: next function to continue
function authenticate: middleware that authorizes the user to continue if
it's an admin.
*/
const authorize = async (req, res, next) => {
    try{
        const role = req.clientRole;
        if(!role) throw new Error("No role found");

        if(role !== "admin")
            res.status(403).send("Access denied");
        else
            next();
    } catch(error) {
        res.status(500).send(error.message);
        console.log(error);
    }
};

module.exports = {
    authorize
};