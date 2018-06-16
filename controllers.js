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
  db.Order.find({}, function (err, data) {
    if (err) {
      res.sendStatus(500);
    } else {
      res.json({
        orders: data
      });
    }
  })
}

exports.updateQuote = function (req, res) {
  let id = req.body.id,
    cost = Number.parseFloat(req.body.cost);
  db.Order.findById(id, function (err, doc) {
    if (err) {
      return res.status(500).send('Order not found');
    }
    doc.cost = cost;

    var emailBody = createEmail(
      doc.customerEmail,
      "Attention Required! Your Newport Bike Delivery Order has been estimated. You need to approve it before delivery!",
      `The amount is: ${doc.cost}`
    );

    doc.save(function (err) {
      if (err) {
        return res.status(500).send('db save failed');
      }
      transporter.sendMail(emailBody, err => {
        if (err) {
          res.status(500).send(err);
        } else {
          res.sendStatus(200);
        }
      });
    });
  });
}

exports.rejectOrder = function (req, res) {
  let id = req.body.id,
    message = req.body.message;

  db.Order.findById(id, function (err, doc) {
    if (err) {
      return res.status(500).send('Order not found');
    }
    doc.status = "rejected";

    var emailBody = createEmail(
      doc.customerEmail,
      "Sorry, We can't accept your order right now"
      `Reason: ${message}`
    );

    doc.save(function (err) {
      if (err) {
        return res.status(500).send('db save failed');
      }
      transporter.sendMail(emailBody, err => {
        if (err) {
          res.status(500).send(err);
        } else {
          res.sendStatus(200);
        }
      });
    });
  });
}

exports.fulfillOrder = function (req, res) {
  let id = req.body.id;

  db.Order.findById(id, function (err, doc) {
    if (err) {
      return res.status(500).send('Order not found');
    }
    doc.status = "fulfilled";

    var emailBody = createEmail(
      doc.customerEmail,
      "Enjoy Your Order!"
      `Thanks for using Newport Bike Delivery! It's nbd at Newport Bike Delivery. Ha ha.`
    );

    doc.save(function (err) {
      if (err) {
        return res.status(500).send('db save failed');
      }
      transporter.sendMail(emailBody, err => {
        if (err) {
          res.status(500).send(err);
        } else {
          res.sendStatus(200);
        }
      });
    });
  });
}