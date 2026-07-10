const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const routes = require('./routes');

app.use('/api', routes);

app.get('/', (req, res) => {
  res.send('Avenir API is running...');
});

module.exports = app;
