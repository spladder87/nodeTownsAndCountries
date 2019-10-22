var express = require('express');
var router = express.Router();

var fs = require('fs');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: true });

const countries = require('../land.json')
const towns = require('../stad.json')

/* GET users listing. */
router.get('/countries', function(req, res, next) {
  res.json(countries);
});

/* GET users listing. */
router.get('/towns', function(req, res, next) {
  res.json(towns);
});

module.exports = router;
