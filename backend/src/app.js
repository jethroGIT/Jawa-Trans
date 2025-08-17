const express = require('express');
const app = express();
const path = require('path');
const apiRoutes = require('./routes/api.js');

app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, '../public/views'));

app.use(express.json());
app.use('/api', apiRoutes);

app.use((req, res, next) => {
  res.status(404).render('404'); 
});

module.exports = app;
