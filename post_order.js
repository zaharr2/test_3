let request = require('request-promise');
let crypto = require('crypto');
let verb = 'POST';
let path = '/api/v1/order';

exports.postData = function(req, res) {
  let expires = Math.round(new Date().getTime() / 1000) + 60;
  let postBody = JSON.stringify(req.body);
  let signature = crypto.createHmac('sha256', process.env.API_SECRET).update(verb + path + expires.toFixed() + postBody).digest('hex');

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
    method: verb,
    body: postBody
  };

  request(requestOptions).then(response => {
    res.json(response);
  }).catch(error => {
    res.json({
      error: error
    });
  })
};
