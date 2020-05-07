let request = require('request-promise');
let crypto = require('crypto');
let verb = 'POST';
let path = '/order';

exports.postData = function(req, res) {
  console.log(JSON.stringify(req.body))

  let expires = Math.round(new Date().getTime() / 1000) + 60;
  // let data = {
  //   symbol: "XBTUSD",
  //   orderQty: 1,
  //   price: 590,
  //   ordType: "Limit"
  // };

// Pre-compute the postBody so we can be sure that we're using *exactly* the same body in the request
// and in the signature. If you don't do this, you might get differently-sorted keys and blow the signature.
  let postBody = JSON.stringify(req.body);

  let signature = crypto.createHmac('sha256', process.env.API_SECRET).update(verb + path + expires + postBody).digest('hex');

  let headers = {
    'content-type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    // This example uses the 'expires' scheme. You can also use the 'nonce' scheme. See
    // https://www.bitmex.com/app/apiKeysUsage for more details.
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
