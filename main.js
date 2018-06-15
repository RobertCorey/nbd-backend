let db = require('./database-connection');
let express = require('express');
let path = require('path');
let app = express();
app.use(express.static('nbd'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/nbd/index.html'));
})

app.listen('8080');