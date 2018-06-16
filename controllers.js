let db = require('./db/db');
let nodemailer = require('nodemailer');
let emailpw = require('./passwords').email;

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: emailpw.address,
    pass: emailpw.password
  }
});

function createEmail(to, subject, html) {
  return mailOptions = {
    from: emailpw.address, // sender address
    to: to, // list of receivers
    subject: subject, // Subject line
    html: '<p>' + html + '</p>' // plain text body
  };
}

exports.createOrder = function (req, res) {
  //TODO backend validation goes here
  new db.Order(req.body).save(err => {
    if (err) {
      res.sendStatus(400);
    } else {
      var emailBody = createEmail('robertbcorey@gmail.com', 'hellofromnewportbike', 'hi were sending you an email');
      transporter.sendMail(emailBody, err => {
        if (err) {
          res.sendStatus(400);
        } else {
          res.sendStatus(200);
        }
      });
    }
  });
}


exports.getAllOrders = function (req, res) {
  db.Order.find({}, function(err, data) {
    if (err) {
      res.sendStatus(500);
    } else {
      res.json({
        orders: data
      });
    }
  })
}