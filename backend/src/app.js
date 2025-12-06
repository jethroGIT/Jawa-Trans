const express = require('express');
const app = express();
const path = require('path');
const apiRoutes = require('./routes/api.js');
const cors = require("cors");


app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, '../public/views'));

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api', apiRoutes);

app.use((req, res, next) => {
  res.status(404).render('404'); 
});

module.exports = app;
