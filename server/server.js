// Import dependencies
const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');
const _ = require('underscore');

const { mongoose } = require('./db/mongoose');
const { News } = require('./models/news');

const app = express();

const port = process.env.PORT || 3000;

module.exports = { app, ObjectID, _ };

const newsApis = require('./apis/news');

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// Main Page
app.get('/', (req, res) => {
  res.send('App is up and running')
});


// Add News
app.post('/news', (req, res) => {
  newsApis.addNews(req, res);
});


// List News
app.get('/news', (req, res) => {
  newsApis.listNews(req, res);
});


// Get one of news by id
app.get('/news/:id', (req, res) => {
  newsApis.getOneOfNews(req, res);
});


// Delete one of the news by its id
app.delete('/news/:_id', (req, res) => {
  newsApis.deleteOneOfNews(req, res);
});


// Edit one of the news by its id
app.post('/news/:_id/update', (req, res) => {
  newsApis.updateOneOfNews(req, res);
});


// Start Server
app.listen('3000', () => {
  console.log(`Server Started On Port ${port}`);
});
