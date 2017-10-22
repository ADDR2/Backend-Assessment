const jwt = require('jsonwebtoken');

const adminUser = {
    id: "0178914c-548b-4a4c-b918-47d6a391530c",
    name: "Whitley",
    email: "whitleyblankenship@quotezart.com",
    role: "admin"
};

adminUser.token = jwt.sign(
    { id: adminUser.id, email: adminUser.email},
    process.env.JWT_SECRET
).toString();

const normalUser = {
    id: "162db393-55ef-4b2c-988d-17ba7c606785",
    name: "Harris",
    email: "harrisblankenship@quotezart.com",
    role: "user"
};

normalUser.token = jwt.sign(
    { id: normalUser.id, email: normalUser.email},
    process.env.JWT_SECRET
).toString();

const ghostToken = jwt.sign(
    { id: "", email: ""},
    process.env.JWT_SECRET
).toString();

module.exports = {
    adminUser,
    normalUser,
    ghostToken
};