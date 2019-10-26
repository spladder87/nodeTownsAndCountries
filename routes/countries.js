var express = require('express');
var router = express.Router();

var fs = require('fs');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: true });


/* GET users listing. */
router.get('/', function (req, res, next) {
  fs.readFile('land.json', (err, data) => {
    if (err) throw err;
    let country = JSON.parse(data);

    var html = '';
    html += "<ul>";
    for (var i = 0; i < country.length; i++) {
      html += "<h4>" + country[i].countryname; + "</h4>";
      html += `<a href='/countries/${country[i].countryname}/${country[i].id}'> Mer info</a>`;
      html += `<form action="/countries/delete" method="post">
    id: <input type="number" name="id" value="${country[i].id}" readonly>
    <input type="submit" value="Ta bort">
    </form>`
    }
    html += "</ul>";
    html += "<a href='/countries/new'>Lägg till nytt land</a>";
    res.send(html);
  });

});

//create new country
router.get('/new', function (req, res, next) {
  fs.readFile('land.json', (err, data) => {

    if (err) throw err;
    let country = JSON.parse(data);

    const ids = country.map(id => id.id);
    const sorted = ids.sort((a, b) => a - b);
    var newID = sorted[sorted.length - 1];
    newID++;
    console.log(newID);

    var html = '';
    html += "<h2>" + "Lägg till nytt land" + "</h2>";
    html += `<form action="/countries/new" method="post">
     id: <input type="number" name="id" value="${newID}" readonly></br>
     countryname: <input type="text" name="countryname"></br>
     <input type="submit" value="Lägg till">
     </form>`

    html += "</ul>";
    html += "</br><a href='javascript:history.back()'>Go Back</a>";
    res.send(html);
  });

});

router.post('/new', urlencodedParser, function (req, res, next) {
  console.log(req.body);
  fs.readFile('land.json', (err, data) => {

    if (err) throw err;

    var country = JSON.parse(data);

    var newCountry = {
      "id": "",
      "countryname": ""
    }

    newCountry.id = req.body.id;
    newCountry.countryname = req.body.countryname;

    console.log(newCountry)
    country.push(newCountry);

    var newTown = JSON.stringify(country, null, 2);

    fs.writeFile('land.json', newTown, (err, data) => {
      if (err) throw err;
    })
    console.log("New Country added");

    res.redirect('/countries');
  })

});

router.post('/delete', urlencodedParser, function (req, res, next) {
  console.log(req.body.id);
  console.log("hej");
  fs.readFile('land.json', (err, data) => {
    if (err) throw err;
    let country = JSON.parse(data);
    var elementPos;
    for (let index = 0; index < country.length; index++) {
      if (country[index].id == req.body.id) {
        elementPos = index;
      }
    }
    country.splice(elementPos, 1);
    let updatedCountries = JSON.stringify(country, null, 2);

    fs.writeFile('land.json', updatedCountries, (err, data) => {
      if (err) throw err;
    })

  });



  fs.readFile('stad.json', (err, data) => {
    if (err) throw err;
    let towns = JSON.parse(data);
    var elementPos;
    //console.log(towns[0]);

    for (let index = towns.length - 1; index >= 0; index--) {
      if (towns[index].countryid == req.body.id) {
        console.log(index);
        towns.splice(index, 1);

      }
    }

    let updatedTowns = JSON.stringify(towns, null, 2);

    fs.writeFile('stad.json', updatedTowns, (err, data) => {
      if (err) throw err;
    })

  })
  console.log("Country deleted and all towns");
  res.redirect("/countries");
});

/* GET Countries towns. */
router.get('/:countryname/:id', function (req, res, next) {
  fs.readFile('stad.json', (err, data) => {
    if (err) throw err;
    let towns = JSON.parse(data);
    var html = '';
    html += "<h2>" + "Städer i " + req.params.countryname + "</h2>";
    html += "<ul>";


    for (var i = 0; i < towns.length; i++) {
      if (towns[i].countryid == req.params.id) {
        html += "<li>";
        html += `<form action="/countries/towns/edit" method="post">
        id: <input type="number" name="id" value="${towns[i].id}" readonly></br>
        stadname: <input type="text" name="stadname" value="${towns[i].stadname}"></br>
        countryid: <input type="number" name="countryid" value="${req.params.id}" readonly></br>
        population: <input type="number" name="population" value="${towns[i].population}"></br>
        <input type="hidden" name="countryname" value="${req.params.countryname}">
        <input type="submit" value="Ändra">
        </form>`
        html += `</br><a href='/countries/${req.params.countryname}/${req.params.id}/${towns[i].stadname}/${towns[i].id}/delete'>Ta bort stad</a></br>`;
        html += "<hr>";
        html += "</li>";
      }
    }
    html += "</ul>";
    html += `<a href='/countries/${req.params.countryname}/${req.params.id}/towns/new'>Lägg till nytt stad</a></br>`;
    html += `<a href='/countries'>Go Back</a>`;
    res.send(html);
  })

});

router.post('/towns/new', urlencodedParser, function (req, res, next) {
  console.log(req.body);
  fs.readFile('stad.json', (err, data) => {

    if (err) throw err;

    var towns = JSON.parse(data);

    var newTown = {
      "id": "",
      "stadname": "",
      "countryid": "",
      "population": ""
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

    res.redirect('/countries/' + req.body.countryname + "/" + req.body.countryid);
  })

});


//EDIT TOWN
router.post('/towns/edit', urlencodedParser, function (req, res, next) {
  console.log(req.body.countryname);
  fs.readFile('stad.json', (err, data) => {

    if (err) throw err;

    var towns = JSON.parse(data);
    let elementPos;
    for (let index = 0; index < towns.length; index++) {
      if (towns[index].id == req.body.id) {
        elementPos = index;
      }
    }

    //towns[elementPos].id = req.body.id;
    towns[elementPos].stadname = req.body.stadname;
    //towns[elementPos].countryid = req.body.countryid;
    towns[elementPos].population = req.body.population;

    //console.log(towns)


    var saveTown = JSON.stringify(towns, null, 2);

    fs.writeFile('stad.json', saveTown, (err, data) => {
      if (err) throw err;
    })
    console.log("Town edited");

    res.redirect('/countries/' + req.body.countryname + '/' + req.body.countryid);
  })

});

//Delete town
router.get('/:countryname/:countryid/:stadname/:id/delete', urlencodedParser, function (req, res, next) {
  console.log(req.params);
  console.log("hej");
  fs.readFile('stad.json', (err, data) => {
    if (err) throw err;
    let town = JSON.parse(data);
    var elementPos;
    for (let index = 0; index < town.length; index++) {
      if (town[index].id == req.params.id) {
        elementPos = index;
      }
    }
    town.splice(elementPos, 1);
    let updatedTowns = JSON.stringify(town, null, 2);

    fs.writeFile('stad.json', updatedTowns, (err, data) => {
      if (err) throw err;
    })

  });
  console.log("Town deleted");
  res.redirect('/countries/' + req.params.countryname + '/' + req.params.countryid);
});

router.get('/:countryname/:countryid/towns/new', function (req, res, next) {
  fs.readFile('stad.json', (err, data) => {

    if (err) throw err;
    let towns = JSON.parse(data);

    const ids = towns.map(id => id.id);
    const sorted = ids.sort((a, b) => a - b);
    var newID = sorted[sorted.length - 1];
    newID++;
    console.log(newID);

    var html = '';
    html += "<h2>" + "Lägg till ny stad" + "</h2>";
    html += `<form action="/countries/towns/new" method="post">
     id: <input type="number" name="id" value="${newID}" readonly></br>
     Stad: <input type="text" name="stadname"></br>
     countryid: <input type="number" name="countryid" value="${req.params.countryid}" readonly></br>
     Population: <input type="number" name="population"></br>
     <input type="hidden" name="countryname" value="${req.params.countryname}">
     <input type="submit" value="Lägg till  ">
     </form>`

    html += "</ul>";
    html += "<a href='javascript:history.back()'>Go Back</a>";
    res.send(html);
  });

});






module.exports = router;
