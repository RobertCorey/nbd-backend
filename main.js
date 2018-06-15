let db = require('./db/db');
let express = require('express');
let path = require('path');
let app = express();
app.use(express.static('nbd'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/nbd/index.html'));
})

app.post('/submitOrder', requre);
app.listen('8080');