let request = require('request-promise');
let crypto = require('crypto');
let verb = 'GET';
let path = '/api/v1/instrument/active';

// let data = {
//   symbol: 'XBTUSD',
//   lastPrice: 590
// };
// let postBody = JSON.stringify(data);

exports.list = function(req, res) {
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
        symbol: el.symbol,
        lastPrice: el.lastPrice
      }
    }));
  }).catch(error => {
    res.json({
      error: error
    });
  })
};
