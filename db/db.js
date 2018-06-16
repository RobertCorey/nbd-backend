var pw = require('./../passwords').database;
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var validator = require('validator');
var mongoURI = `mongodb://${pw.user}:${pw.password}@${pw.address}`;
mongoose.connect(mongoURI);

mongoose.Promise = global.Promise;
var database = mongoose.connection;

var orderSchema = new Schema({
  customerName:{
    type: String,
    validate:{
    var testName=validator.isAlphanumeric(v);
    if (testName===false){
      message:'${v} is not a valid name, please enter again'
    }
  }
    required:[true, 'Please enter a customer name']
  },

  customerEmail: {
    type: String,
    validate:{
    var testEmail=validator.isEmail(v);
    if (testEmail===false){
      message:'${v} is not a valid email, please enter again'
    }
  }
    required:[true, 'Please enter a customer email']
  }

  customerPhone:{
    type: String,
    validate:{
    validator: function(v){
      return /\d{3}-\d{3}-\d{4}/.test(v);
    },
    message:'{Value} is not a valid phone number, please enter again'
    }
    required:[true, 'Please enter a phone number'],
  }

  } ,
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
