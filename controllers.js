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
  let data = req.body;
  data.startAddress.url = decodeURIComponent(data.startAddress.url);
  data.endAddress.url = decodeURIComponent(data.endAddress.url);
  //TODO backend validation goes here
  new db.Order(data).save(err => {
    if (err) {
      res.status(400).send(err);
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
    doc.state = 'quoted';

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

exports.adminRejectOrder = function (req, res) {
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

exports.customerRejectOrder = function (req, res) {
  let id = req.query.id,
    message = req.body.message;
  if(!id.match(/^[0-9a-fA-F]{24}$/)) {return res.status(500).send('bad id');}

  db.Order.findById(id, function (err, doc) {
    if (err) {
      return res.status(500).send('Order not found');
    }
    doc.status = "rejected";

    var emailBody = createEmail(
      doc.customerEmail,
      "You have rejected the quote we provided"
      `Sorry we were not able to accomodate your request. Try texting or calling 4012398922 to talk to a real person.`
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

exports.customerAcceptOrder = function (req, res) {
  let id = req.query.id,
    message = req.body.message;
  if(!id.match(/^[0-9a-fA-F]{24}$/)) {return res.status(500).send('bad id');}

  db.Order.findById(id, function (err, doc) {
    if (err) {
      return res.status(500).send('Order not found');
    }
    doc.status = "accepted";

    var emailBody = createEmail(
      doc.customerEmail,
      "We're on our way!",
      `Thank You for accepting our quote, We're on our way with your order!`
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

