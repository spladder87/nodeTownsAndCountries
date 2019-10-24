var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var countriesRouter = require('./routes/countries');
var apiRouter = require('./routes/api');
var urlencodedParser = bodyParser.urlencoded({ extended: true });

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/public"));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/countries', countriesRouter);
app.use('/api', apiRouter);

module.exports = app;
