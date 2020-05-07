require('dotenv').config();
const express = require('express');
const cors = require('cors');
// const bodyParser = require('body-parser');
const morgan = require('morgan');

const app = express();

app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

let request = require('request');
let crypto = require('crypto');

let apiKey = process.env.API_KEY;
let apiSecret = process.env.API_SECRET;
let apiUrl = process.env.API_URL;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

let getOrder = require('./get_order');
let postOrder = require('./post_order');
let getTradeBucketed = require('./get_trade_bucketed');
let getInstrumentActive = require('./get_instrument_active');


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.get('/', (req, res) => {
  res.json({
    message: "Hello world!!!"
  })
});

//##########################################################################   ROUTES
//
//##########################################################################   GET /instrument/active

app.get('/instrument/active', getInstrumentActive.list);

//##########################################################################   GET /trade/bucketed

app.get('/trade/bucketed', getTradeBucketed.list);

//##########################################################################   GET /order

app.get('/order', getOrder.list);

//##########################################################################   POST /order

app.post('/order', postOrder.postData);

//##########################################################################   END

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});




