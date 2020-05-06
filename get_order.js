var request = require('request-promise');
var crypto = require('crypto');
var verb = 'GET';
var path = '/order';
var expires = Math.round(new Date().getTime() / 1000) + 60; // 1 min in the future
// var data = '';
// var postBody = JSON.stringify(data);
// var signature = crypto.createHmac('sha256', apiSecret).update(verb + path + expires.toFixed() + postBody).digest('hex');
var signature = crypto.createHmac('sha256', process.env.API_SECRET).update(verb + path + expires.toFixed()).digest('hex');
var headers = {
  'content-type': 'application/json',
  'Accept': 'application/json',
  'X-Requested-With': 'XMLHttpRequest',
  'api-expires': expires,
  'api-key': process.env.API_KEY,
  'api-signature': signature
};

const requestOptions = {
  headers: headers,
  url: process.env.API_URL + path,
  method: 'GET',
  json: true
};

exports.list = function(req, res) {
  request(requestOptions).then(response => {
    res.json(response.map(el => {
      return {
        orderID: el.orderID,
        symbol: el.symbol,
        orderQty: el.orderQty,
        timestamp: el.timestamp,
        side: el.side,
        price: el.price,
        ordStatus: el.ordStatus
      }
    }));
  }).catch(error => {
    console.log("error", error)
    res.json({
      error: error
    });
  })
};