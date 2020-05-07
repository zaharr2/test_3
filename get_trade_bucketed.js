let request = require('request-promise');
let crypto = require('crypto');
let verb = 'GET';

// let data = '';
// let postBody = JSON.stringify(data);
// let signature = crypto.createHmac('sha256', apiSecret).update(verb + path + expires.toFixed() + postBody).digest('hex');

exports.list = function(req, res) {
  let path = '/api/v1/trade/bucketed?binSize=1m&partial=false&count=100&reverse=true&symbol=' + req.query.symbol;
  let expires = Math.round(new Date().getTime() / 1000) + 60;
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
        timestamp: el.timestamp,
        open: el.open,
        high: el.high,
        low: el.low,
        close: el.close,
        grossValue: el.grossValue // TODO: не существующий параметр
      }
    }));
  }).catch(error => {
    res.json({
      error: error
    });
  })
};
