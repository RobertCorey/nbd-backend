let db = require('./db');

db.Order.find({}, function(err, data) {
  console.log(data);
})