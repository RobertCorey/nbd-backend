var pw = require('./../passwords').database;
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var mongoURI = `mongodb://${pw.user}:${pw.password}@${pw.address}`;
mongoose.connect(mongoURI);

mongoose.Promise = global.Promise;
var database = mongoose.connection;

var orderSchema = new Schema({
  customerName:{
    type: String,
    required:[true, 'Please enter a customer name']
  },
  customerEmail: {
    type: String,
    required:[true, 'Please enter a customer email']
  customerPhone: String,
  startAddress{
    type: Object,
    required: [true, 'Please enter a start address']
  },
  endAddress: {
  type: Object,
  required : [true, 'Please enter a end address']
},
  Details: {
    type: String,
    required: [true, 'Please enter a description']
  },
  cost: {
    type: Number,
    required: [true, 'Please enter a cose']
    default:-1,
  },
  status: {
    type: String,
    default: 'new',
    enum: ['new', 'quoted', 'accepted', 'rejected', 'fulfilled']
  },
  createdOn: {type: Date, default: Date.now()}
});

var Order = database.model('Order', orderSchema);
database.on('error', console.error.bind(console, 'MongoDB connection error:'));


exports.db = database;
exports.Order = Order;
