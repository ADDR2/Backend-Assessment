/* 3rd party libraries */
const express = require("express");
const bodyParser = require("body-parser");
const app = express();

/* Import routes */
const clientsRoute = require(__dirname + "/routes/client");
const policiesRoute = require(__dirname + "/routes/policy");

/* Post from evironment variables or 3000 by default */
const port = process.env.PORT || 3000;

/* Body parser to read json */
app.use(bodyParser.json());

/* Define routes */
app.use("/client", clientsRoute);
app.use("/policy", policiesRoute);

/* Listen on given port */
app.listen(port, () => {
  console.log(`Server up in port ${port}`);
});
