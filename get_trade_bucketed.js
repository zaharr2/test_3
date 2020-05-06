var request = require('request');
var crypto = require('crypto');
var verb = 'GET';
var path = '/api/v1/trade/bucketed?binSize=1m&partial=false&count=100&reverse=true&symbol=XBTUSD';
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
  method: 'GET'
};

exports.list = function(req, res) {
  request(requestOptions, (error, response, body) => {
    if (error) {
      res.json({
        error: error
      });
    }

    let parserBody = JSON.parse(body).map(el => {
      return {
        timestamp: el.timestamp,
        open: el.open,
        high: el.high,
        low: el.low,
        close: el.close,
        grossValue: el.grossValue // TODO: не существующий параметр
      }
    });

    res.json(parserBody);
  });
};
