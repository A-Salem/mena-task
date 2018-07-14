const mongoose = require('mongoose');

// Set mongoose options
mongoose.set('useFindAndModify', false);

// global text schema
const text_schema = {
    type: String,
    required: true,
    minlength: 3,
    trim: true
  };

// define news newsSchema
const newsSchema = new mongoose.Schema({
  title: {...text_schema, unique: true},
  short_description: text_schema,
  text: text_schema,
  date: {
    type: Number,
    required: true,
    min: 0,
    default: new Date().getTime()
  },
  updatedAt: {
    type: Number,
    min: 0
  }
});

// create indexes for title and date fields
newsSchema.index({title: 1});
newsSchema.index({date: 1});
newsSchema.index({title: 1, date: 1}, {unique: true});

// create mongoose model
const News = mongoose.model('News', newsSchema);

module.exports = { News };
