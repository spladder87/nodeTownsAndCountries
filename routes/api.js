var express = require('express');
var router = express.Router();

var fs = require('fs');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: true });



/* GET users listing. */
router.get('/countries', function(req, res, next) {
  fs.readFile('land.json', (err, data) => {
    if (err) throw err;
    let countries = JSON.parse(data);
  res.json(countries);
});
});

/* GET users listing. */
router.get('/towns', function(req, res, next) {
  fs.readFile('stad.json', (err, data) => {
    if (err) throw err;
    let towns = JSON.parse(data);
  res.json(towns);
});

});

module.exports = router;
