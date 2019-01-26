const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const Data = require('./data');

const API_PORT = 3001;
const app = express();
const router = express.Router();

//MongoDB database
const dbRoute = "mongodb://<kevinrsanji%40gmail.com>:<Zyzzbrah4298>@ds213255.mlab.com:13255/suggestions-app";

//connects backend to database

mongoose.connect(
  dbRoute,
  { useNewUrlParser: true }
);

let db = mongoose.connection;

db.once('open', () => console.log('connected to database'));

//checks if connection with database is successful
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

//made for logging and
//bodyParser, parses the request body to be a readable json format
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));

//get method to fetch data in database
router.get('/getData', (req, res) => {
  Data.find((err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data });
  });
});

//update method to overwrite existing data in database
router.post('/updateData', (req, res) => {
  const { id, update } = req.body;
  Data.findOneAndUpdate(id, update, err => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});

//delete method to remove data in database
router.delete('/deleteData', (req, res) => {
  const { id } = req.body;
  Data.findOneAndDelete(id, err => {
    if (err) return res.send(err);
    return res.json({ success: true });
  });
});

//create method add new data
router.post('/putData', (req, res) => {
  let data = new Data();

  const { id, message } = req.body;

  if ((!id && id !== 0) || !message) {
    return res.json({
      success: false,
      error: 'INVALID INPUTS'
    });
  }
  data.message = message;
  data.id = id;
  data.save(err => {
    if (err) return res.json({ success: false, error: err });
  });
});

//append /api for http requests
app.use('/api', router);

//launch our backend into port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));
