let pw = require('./passwords').database;
let mongoose = require('mongoose');
let mongoURI = `mongodb://${pw.user}:${pw.password}@${pw.address}`;
mongoose.connect(mongoURI)
mongoose.Promise = global.Promise;

let database = mongoose.connection;
database.on('error', console.error.bind(console, 'MongoDB connection error:'));
exports.db = database;