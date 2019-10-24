var express = require('express');
var router = express.Router();

var fs = require('fs');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: true });

let countries = require('../land.json')
let towns = require('../stad.json')



/* GET users listing. */
router.get('/', function(req, res, next) {
  var html='';
  html +="<ul>";
  for(var i = 0; i < countries.length; i++){
    html +="<h4>" + countries[i].countryname; + "</h4>";
    html +=`<a href='/countries/${countries[i].countryname}/${countries[i].id}'> Mer info</a>`;
    html +=`<form action="/countries/delete" method="post">
    id: <input type="number" name="id" value="${countries[i].id}" readonly>
    <input type="submit" value="Ta bort">
    </form>`
  }
  html +="</ul>";
  html +="<a href='/countries/new'>Lägg till nytt land</a>";
      res.send(html);

});

router.post('/delete', urlencodedParser, function(req, res, next) {
  console.log(req.body.id);
  console.log("hej");
  fs.readFile('land.json',  (err,data) => {
    if (err) throw err;
    let country = JSON.parse(data);
    var elementPos;
    for (let index = 0; index < country.length; index++) {
      if (country[index].id == req.body.id){
      elementPos = index;
      }
    }
    country.splice(elementPos,1);
    let deleteCountry = JSON.stringify(country, null, 2);
  
    fs.writeFile('land.json', deleteCountry, (err, data) => {
       if (err) throw err;
     })

    });



  fs.readFile('stad.json',  (err,data) => {
      if (err) throw err;
      let towns = JSON.parse(data);
      var elementPos;
      //console.log(towns[0]);
      
      for (let index = towns.length -1; index >= 0 ; index--) {
        if(towns[index].countryid == req.body.id){
          console.log(index);
          towns.splice(index,1);
        
      } 
      }
 
      let deleteTown = JSON.stringify(towns, null, 2);
    
      fs.writeFile('stad.json', deleteTown, (err, data) => {
         if (err) throw err;
       })
  
      })
    console.log("Country deleted and all towns");
    countries = require('../land.json')
    towns = require('../stad.json')
    res.send("Congrats u succesfully removed a country <a href='/countries'>Go Back</a>");
  });

router.get('/:countryid/towns/new', function(req, res, next) {
  const ids = towns.map(id => id.id);
  const sorted = ids.sort((a, b) => a - b);
  var newID = sorted[sorted.length-1];
  newID++;
  console.log(newID);

  var html='';
  html +="<h2>"+ "Lägg till ny stad" +"</h2>";
  html +=`<form action="/countries/towns/new" method="post">
     id: <input type="number" name="id" value="${newID}" readonly></br>
     Stad: <input type="text" name="stadname"></br>
     countryid: <input type="number" name="countryid" value="${req.params.countryid}" readonly></br>
     Population: <input type="number" name="population"></br>
     <input type="submit" value="Lägg till">
     </form>`

  html +="</ul>";
  html +="<a href='javascript:history.back()'>Go Back</a>";
      res.send(html);
  
});

router.post('/towns/new', urlencodedParser, function(req, res, next) {
console.log(req.body);
fs.readFile('stad.json', (err,data) => {

  if (err) throw err;
  
  var towns = JSON.parse(data);

  var newTown = {
    "id":"",
    "stadname":"",
    "countryid":"",
    "population":""
  }

  newTown.id = req.body.id;
  newTown.stadname = req.body.stadname;
  newTown.countryid = req.body.countryid;
  newTown.population = req.body.population;

  console.log(newTown)
  towns.push(newTown);

  var saveTown = JSON.stringify(towns, null, 2);

  fs.writeFile('stad.json', saveTown, (err, data) => {
    if (err) throw err;
  })
  console.log("New town added");

  towns = require('../stad.json')
  res.send('/countries');
  })
  
});

/* GET Countries towns. */
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
  html +=`<a href='/countries/${req.params.id}/towns/new'>Lägg till nytt stad</a>`;
  html +="<a href='javascript:history.back()'>Go Back</a>";
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
