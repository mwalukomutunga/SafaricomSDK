const express = require("express");
const Payment = express();
var dateFormat = require("dateformat");
var now = new Date();
const fs = require("fs");
var Token = "";
var request = require("request"),
  consumer_key = "wpmPKvp3gtDMjVaBGcCapCZxbOmZyAS1",
  consumer_secret = "EdAfxqgVC53tw0WT",
  url =
    "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";
auth =
  "Basic " +
  new Buffer.from(consumer_key + ":" + consumer_secret).toString("base64");
// var PassKey =
//   "aEVz4vwPHBzIUiC1kbNnqrxABAzbIG/qOprQgc5M8ijZxCC+R4yijY86yc1C3tZtW21qlstG9a8GoywAZ64kQ7ZMeQd1/9FiYSDnvT7BgRZ1/Sl7tU3v6toG75ek37NzB4M/RH7+72Ut9SkTXdOH8bT3neiAlUccM1601B/gtYDl5cXZ8YoF0Biffp4wxM2n3uAFHrN/5wrvGJ6TpQELkaPU7c741V8S8our9YVCL0Z/H1D8+WboiucGctsPiLmnKncbL59pmXg2XDamchsXmnR2I7/wZJNx9NH+0+cVALMsOIhT3Jm7bC5nqBUKrghurbYD3bc1E9tDEg65xHYb/w==";
// var Timestamp = "20160216165627";

function RequestToken(req, res, next) {
  request(
    {
      url: url,
      headers: {
        Authorization: auth
      }
    },
    function(error, response, body) {
      Token = JSON.parse(body).access_token;

      var request1 = require("request"),
        oauth_token = Token,
        uri = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest";
      auth1 = "Bearer " + oauth_token;

      var ShortKey = "174379";
      var Passkey =
        "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919";

      const timeStamp = new Date()
        .toISOString()
        .replace(/[^0-9]/g, "")
        .slice(0, -3);

      var crypto = require("crypto");
      var constants = require("constants");
      // global.PrivateKey = "";
      // fs.readFile("./cert.cer", "utf8", function(err, data) {
      //   var bufferToEncrypt = new Buffer.from(
      //     `${ShortKey}${Passkey}${timeStamp}`
      //   );
      //   var encrypted = crypto
      //     .publicEncrypt(
      //       { key: data, padding: constants.RSA_PKCS1_PADDING },
      //       bufferToEncrypt
      //     )
      //     .toString("base64");
      //   PrivateKey = encrypted;
      // });

      const password = Buffer.from(
        `${ShortKey}${Passkey}${timeStamp}`
      ).toString("base64");

      request1(
        {
          method: "POST",
          url: uri,
          headers: {
            Authorization: auth1
          },
          json: {
            BusinessShortCode: ShortKey,
            Password: password,
            Timestamp: timeStamp,
            TransactionType: "CustomerPayBillOnline",
            Amount: "1",
            PartyA: "254710623337",
            PartyB: "174379",
            PhoneNumber: "254710623337",
            CallBackURL: "https://b0ba0073.ngrok.io/api/callback",
            AccountReference: "test234",
            TransactionDesc: "Test "
          }
        },
        function(error, response, body) {
          if (error) {
            res.status(200).json(error);
          } else {
            res.status(200).json(body);
          }
        }
      );
    }
  );
}

module.exports = { RequestToken };
