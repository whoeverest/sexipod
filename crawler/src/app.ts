// Imports
// I was wondering why I cannot import like this:
// import express from 'express'

import express = require('express');
import path = require('path');
import flash = require('express-flash');
import expressValidator = require('express-validator');
import session = require('express-session');
import bodyParser = require('body-parser');

import { SESSION_SECRET } from "./util/secrets";

// Controllers (route handlers)
import * as crawlerHomeController from "./controllers/crawlerHome";

// Create Express server
const app = express();

// Express configuration
app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "pug");

app.use(
    express.static(path.join(__dirname, "public"))

    // Do we need caching? If yes, ETag or max-age?
    // express.static(path.join(__dirname, "public"), { maxAge: 86400 })
);
app.use(flash());
app.use(expressValidator());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    resave: true,
    saveUninitialized: true,
    // secret: SESSION_SECRET 
    // The problem with secret is that it needs to be of type 'string | string[]'.
    // and it is for some reason 'string | undefined'
    // I should check that out soon.
    secret: "qwerty123456"
}));

// Primary app routes
app.get("/", crawlerHomeController.index);
app.post("/url", crawlerHomeController.postURL);

export default app;