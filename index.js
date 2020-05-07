require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

let getOrder = require('./get_order');
let postOrder = require('./post_order');
let getTradeBucketed = require('./get_trade_bucketed');
let getInstrumentActive = require('./get_instrument_active');

//##########################################################################   ROUTES
//
//##########################################################################   GET /

app.get('/', (req, res) => {
  res.json({
    message: "Hello world!!!"
  })
});

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
