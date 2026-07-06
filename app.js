require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const connectDB = require('./config/database');

connectDB();

const dogroutes = require('./routes/dogs');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/dogs', dogroutes);

app.get('/', (req, res) => {
  res.redirect('/dogs');
});

app.use((req, res) => {
  res.status(404).json({ title: 'Page Not Found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ title: 'Error', message: err.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
