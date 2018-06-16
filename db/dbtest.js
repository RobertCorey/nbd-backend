let db = require('./db');
let pan = require('./mock-order').panini;

var foo = new db.Order(pan).save(function(err) {
  if (err) {console.log(err);}
});

var foo = new db.Order({}).save(function(err) {
  if (err) {console.log(err);}
});

db.Order.find({}, function(err, data) {
  console.log(data);
})