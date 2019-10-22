var express = require('express');
var router = express.Router();

var fs = require('fs');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: true });

const countries = require('../land.json')
const towns = require('../stad.json')

/* GET users listing. */
router.get('/', function(req, res, next) {
  var html='';
  html +="<ul>";
  for(var i = 0; i < countries.length; i++){
    html +="<h4>" + countries[i].countryname; + "</h4>";
    html +=`<a href='/countries/${countries[i].countryname}/${countries[i].id}'>Mer info</a>`;
    html +=`<form action="/countries/edit" method="post">
    <input type="hidden" id="${countries[i].id}">
    <input type="submit" value="Ändra">
    </form>`
  }
  html +="</ul>";
  html +="<a href='/campgrounds/new'>Lägg till nytt land</a>";
      res.send(html);

});

router.get('/towns/new', function(req, res, next) {
  const ids = towns.map(user => user.id);
  const sorted = ids.sort((a, b) => a - b);
  var newID = sorted[sorted.length-1] + 1;
  console.log(newID);

  var html='';
  html +="<h2>"+ "Lägg till ny stad" +"</h2>";
  html +=`<form action="/towns/new" method="post">
     <input type="hidden" id="">
     <input type="submit" value="Lägg till">
     </form>`

  html +="</ul>";
  html +="<a href='/countries/towns/new'>Lägg till nytt stad</a>";
      res.send(html);
  
});

/* GET users listing. */
router.get('/:countryname/:id', function(req, res, next) {
  var html='';
  html +="<h2>"+ "Städer i " + req.params.countryname + "</h2>";
  html +="<ul>";
  for(var i = 0; i < towns.length; i++){
    if(towns[i].countryid == req.params.id){
    html +="<h4>" + towns[i].stadname; + "</h4>";
    html +=`<a href='/countries/${req.params.countryname}/${req.params.id}/${towns[i].stadname}/${towns[i].id}'> Edit</a>`;
    // html +=`<form action="/countries/edit" method="post">
    // <input type="hidden" id="${countries[i].id}">
    // <input type="submit" value="Ändra">
    // </form>`
    }
  }
  html +="</ul>";
  html +="<a href='/countries/towns/new'>Lägg till nytt stad</a>";
  res.send(html);
  
});





//create new country
router.get('/edit', urlencodedParser, function(req, res, next) {
  var html='';
  html +="<ul>";
  for(var i = 0; i < countries.length; i++){
    html +="<h4>" + countries[i].countryname; + "</h4>";
    html += `<form action="/countries/edit" method="post">
    <input type="hidden" id="${countries[i].id}">
    <input type="submit" value="Ändra">
    </form>`
  }
  html +="</ul>";
  html +="<a href='/campgrounds/new'>Lägg till nytt land</a>";
      res.send(html);

});


//NEW - show form to create new country
router.get("/new", function(req, res){
  res.render("countries/new"); 
});

module.exports = router;
