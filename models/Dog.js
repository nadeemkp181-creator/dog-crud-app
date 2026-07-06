const mongoose = require('mongoose');

const dogSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
    breeds: {
     type: [String],
     required: true,
     default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
   updatedAt: {
    type: Date,
    default: Date.now
  }
});


module.exports = mongoose.model('Dog', dogSchema);
