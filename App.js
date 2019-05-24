const express = require("express");
const app = express();
var bodyParser = require("body-parser");
const Payment = require("./Payment");
var dateFormat = require("dateformat");
var now = new Date();
const fs = require("fs");
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());

app.use(function(req, res, next) {
  //Enabling CORS
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, contentType,Content-Type, Accept, Authorization"
  );
  next();
});

app.get("/", (req, res) =>
  res
    .status(200)
    .json(
      "Welcome to our master Api, proceed to route /api to access our resources"
    )
);
app.get("/api", (req, res) =>
  res.status(200).json("To access our resources proceed to /api/{resource}")
);
//app.use("/api/pay", Payment.RequestToken);
app.use("/api/pay", Payment.RequestToken);
app.post("/api/callback", (req, res, body) => {
  console.log(req.body);
});
app.get("/api/cert", (req, res, body) => {
  var shortKey = "174379";
  var Passkey = "174379";

  var Timestamp = dateFormat(now, "yyyymmddhhiiss");
  var crypto = require("crypto");
  var constants = require("constants");
  var bufferToEncrypt = new Buffer.from(shortKey + Passkey + Timestamp);

  var encrypted = crypto.publicEncrypt(
    {
      key: fs.readFileSync("./cert.cer"),
      padding: constants.RSA_PKCS1_PADDING
    },
    bufferToEncrypt
  );

  console.log("res:", encrypted.toString("base64"));
});
//end of app use routes
app.use((req, res, next) => {
  const error = new Error("resource not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;
