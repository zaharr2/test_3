let request = require('request-promise');
let crypto = require('crypto');
let verb = 'GET';
let path = '/api/v1/order?count=100&reverse=true';

exports.list = function(req, res) {
  let expires = Math.round(new Date().getTime() / 1000) + 60; // 1 min in the future
  let signature = crypto.createHmac('sha256', process.env.API_SECRET).update(verb + path + expires.toFixed()).digest('hex');
  let headers = {
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
    console.log("error", error);
    res.json({
      error: error
    });
  })
};
