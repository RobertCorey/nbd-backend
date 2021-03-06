
let express = require('express');
let path = require('path');
let app = express();
var ctrls = require('./controllers');
app.use(express.static('nbd'));
app.use(express.json());
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/nbd/index.html'));
})

app.post('/createOrder', ctrls.createOrder);
app.get('/getOrder', ctrls.getOrder);
app.get('/customerAcceptOrder', ctrls.customerAcceptOrder);
app.get('/customerRejectOrder', ctrls.customerRejectOrder);

app.post('/getAllOrders', ctrls.getAllOrders);
app.post('/updateQuote', ctrls.updateQuote);
app.post('/adminRejectOrder', ctrls.adminRejectOrder);
app.post('/fulfillOrder', ctrls.fulfillOrder);

app.listen('8080');