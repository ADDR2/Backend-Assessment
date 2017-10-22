# Backend Developer Assessment

## Before running

This projects requires some dependencies and they can be installed running the following command:

```
$> npm install
```

This command should be run at the root of the project. If you get some errors and you are on Linux you may try with this one:

```
$> sudo npm install
```

## To run

Run the command:

```
$> npm start
```

or run it manually like this:

```
$> node server.js
```

This project uses JWT library. In case you want to use a different secret, add it to the command like this:

```
$> export JWT_SECRET=mySecret || SET \"JWT_SECRET=mySecret\" && node server.js

or

$> export JWT_SECRET=mySecret || SET \"JWT_SECRET=mySecret\" && npm start
```

And don't forget to replace ``mySecret`` for your secret.

## To run tests

Run the command:

```
$> npm test
```

or run it manually like this:

```
$> mocha tests/**/*.test.js --exit --timeout 15000
```

This project uses JWT library. In case you want to use a different secret, add it to the command like this:

```
$> export JWT_SECRET=mySecret || SET \"JWT_SECRET=mySecret\" && mocha tests/**/*.test.js --exit --timeout 15000

or

$> export JWT_SECRET=mySecret || SET \"JWT_SECRET=mySecret\" && npm test
```

And don't forget to replace ``mySecret`` for your secret.

## Specifications

This project was written and tested using Node ``v8.1.4`` and requires ES7 syntax support to run.

Is recommended to use a software like [Postman](https://www.getpostman.com/apps) to make requests.

The first step to use the core services is to log in calling a POST service on the route ``<Domain in use>:<Port in Use>/client/login/``. Where ``<Domain in use>`` must be replaced by your domain, like ``localhost`` and ``Port in Use`` by your port (example: ``3000``). You'll need to specify at the body the user's email, the user which is trying to log in, and also the ``Content-Type`` header with the value ``application/json``.

The log in service will return the user information of the user trying to log in and a header called ``x-auth``. The value of that header is the token assigned to that user. So from now on, you'll need that token to call the other services. So, for the other services just add a header called ``x-auth`` with the given token at log in.