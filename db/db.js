var pw = require('./../passwords').database;
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var mongoURI = `mongodb://${pw.user}:${pw.password}@${pw.address}`;
mongoose.connect(mongoURI);

mongoose.Promise = global.Promise;
var database = mongoose.connection;

var orderSchema = new Schema({
  customerName: String,
  customerEmail: String,
  customerPhone: String,
  startAddress: Object,
  endAddress: Object,
  Details: String,
  cost: Number,
  status: {
    type: String,
    enum: ['new', 'quoted', 'accepted', 'rejected', 'fulfilled']
  },
  createdOn: {type: Date, default: Date.now()}
});

var Order = database.model('Order', orderSchema);
database.on('error', console.error.bind(console, 'MongoDB connection error:'));


exports.db = database;
exports.Order = Order;