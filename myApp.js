require('dotenv').config();
let bodyParser = require('body-parser');

let express = require('express');
let app = express();


console.log('Hello World')

let staticAssetsPath = __dirname + "/public";

app.use("/public", express.static(staticAssetsPath));
app.use(logger);

// Define Logger

function logger(req, res, next)
{
    console.log(req.method + " " + req.path + " - " + req.ip);
    next();
}

// GET root
let getFilePath = __dirname + "/views/index.html"
app.get("/", getDefaultHandler);

function getDefaultHandler(req, res)
{
    res.sendFile(getFilePath);
}

// GET /json
app.get("/json", getJsonHandler);

function getJsonHandler(req, res)
{
    let obj = {};
    if (process.env.MESSAGE_STYLE == "uppercase")
    {
        obj["message"] = "HELLO JSON";
    }
    else
    {
        obj["message"] = "Hello json";
    }
    res.json(obj);
}

// GET /now
// Chain middleware function addCurrTime() to GET /now

app.get("/now", addCurrTime, getNowHandler);

function addCurrTime(req, res, getNowHandler)
{
    req.time = new Date().toString();
    getNowHandler();
}

function getNowHandler(req, res)
{
    let obj = {"time" : req.time};
    res.json(obj);
}

// GET /echo
app.get("/:param1/echo", getEchoHandler);

function getEchoHandler(req, res)
{
    let obj = {"echo" : req.params.param1};
    res.json(obj);
}

// GET /name
app.get("/name", getNameHandler);

function getNameHandler(req, res)
{
    firstName = req.query.first;
    lastName = req.query.last;
    let obj = {"name" : firstName + " " + lastName};
    console.log(firstName, lastName);
    res.json(obj);
}

// this routes any POSTs to the GET handler created above
app.route("/name").get(getNameHandler).post(getNameHandler);


module.exports = app;
