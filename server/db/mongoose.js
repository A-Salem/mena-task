const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// MongoDB URL
const dbHost = 'mongodb://localhost:27017/mena';
// Connect to mongodb
mongoose.connect(dbHost, { useNewUrlParser: true });

module.exports = { mongoose };
