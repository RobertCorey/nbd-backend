let db = require('./db/db');

exports.createOrder = function (req, res) {
  //TODO backend validation goes here
  new db.Order(req.body).save(err =>{
    if (err) {
      res.sendStatus(400);
    } else {
      res.sendStatus(200);
    }
  });
}