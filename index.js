require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const app = express();

app.use(morgan('tiny'));
app.use(cors());
app.use(bodyParser.json());

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var request = require('request');
var crypto = require('crypto');

var apiKey = process.env.API_KEY;
var apiSecret = process.env.API_SECRET;
var apiUrl = process.env.API_URL;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.get('/', (req, res) => {
  res.json({
    message: "Hello world!!!"
  })
});

//##########################################################################   /order
app.get('/order', (req, res) => {
  var verb = 'POST';
  var path = '/api/v1/order';
  var expires = Math.round(new Date().getTime() / 1000) + 60; // 1 min in the future
  var data = {
    symbol: "XBTUSD",
    orderQty: 1,
    price: 590,
    ordType: "Limit"
  };

// Pre-compute the postBody so we can be sure that we're using *exactly* the same body in the request
// and in the signature. If you don't do this, you might get differently-sorted keys and blow the signature.
  var postBody = JSON.stringify(data);

  var signature = crypto.createHmac('sha256', apiSecret).update(verb + path + expires + postBody).digest('hex');

  var headers = {
    'content-type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    // This example uses the 'expires' scheme. You can also use the 'nonce' scheme. See
    // https://www.bitmex.com/app/apiKeysUsage for more details.
    'api-expires': expires,
    'api-key': apiKey,
    'api-signature': signature
  };

  const requestOptions = {
    headers: headers,
    url: apiUrl + path,
    method: verb,
    body: postBody
  };

  request(requestOptions, (error, response, body) => {
    if (error) {
      res.json({
        error: error
      });
    }
    res.json({
      message: body
    });
  });
});

//##########################################################################   /instrument/active

app.get('/instrument/active', (req, res) => {
  var verb = 'GET';
  var path = '/api/v1/instrument/active';
  var expires = Math.round(new Date().getTime() / 1000) + 60; // 1 min in the future
  var data = {
    symbol: 'XBTUSD',
    lastPrice: 590
  };
  var postBody = JSON.stringify(data);
  var signature = crypto.createHmac('sha256', apiSecret).update(verb + path + expires.toFixed() + postBody).digest('hex');
  var headers = {
    'content-type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    'api-expires': expires,
    'api-key': apiKey,
    'api-signature': signature
  };

  const requestOptions = {
    headers: headers,
    url: apiUrl + path,
    method: 'GET',
    body: postBody
  };

  request(requestOptions, (error, response, body) => {
    if (error) {
      res.json({
        error: error
      });
    }
    res.json(body);
  });
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});




