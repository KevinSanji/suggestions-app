const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//data base's data structure
const DataSchema = new Schema(
  {
    id: Number,
    message: String
  },
  { timestamps: true }
);

//export the new Schema so we can modify it with Node
module.exports = mongoose.model('Data', DataSchema);
