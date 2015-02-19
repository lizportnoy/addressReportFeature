 // API endpoint{"accessLevel": "public", "contactPoint": {"fn": "<Nobody>", "hasEmail": "mailto:"}, "description": "Demographic statistics broken down by school districts", "distribution": [{"downloadURL": "https://data.cityofnewyork.us/api/views/g3vh-kbnw/rows.csv?accessType=DOWNLOAD", "mediaType": "text/csv"}, {"downloadURL": "https://data.cityofnewyork.us/api/views/g3vh-kbnw/rows.rdf?accessType=DOWNLOAD", "mediaType": "application/rdf+xml"}, {"downloadURL": "https://data.cityofnewyork.us/api/views/g3vh-kbnw/rows.json?accessType=DOWNLOAD", "mediaType": "application/json"}, {"downloadURL": "https://data.cityofnewyork.us/api/views/g3vh-kbnw/rows.xml?accessType=DOWNLOAD", "mediaType": "application/xml"}], "identifier": "https://data.cityofnewyork.us/api/views/g3vh-kbnw", "issued": "2011-10-08", "keyword": ["boundary", "district", "community", "demography", "demographic", "statistic", "youth", "development", "neighborhood", "school", "education", "lifelong learning"], "landingPage": "https://data.cityofnewyork.us/d/g3vh-kbnw", "modified": "2014-10-25", "publisher": {"name": "data.cityofnewyork.us"}, "theme": ["Education"], "title": "School District Breakdowns"}
var express = require('express');
var morgan = require('morgan');
var request = require('request');
var bodyParser = require('body-parser');
var app = express();

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(__dirname));


app.listen(3000);

app.get('/getEvents', function (req, res) {
  request('http://api.eventful.com/json/events/search?app_key=kDxLvDwG9XhPF2m8&where=' + req.query.location + '&within=10&date=This+Week&sort_order=popularity&page_number=0&page_size=5',
   function (error, response, body) {
      if(error) {
        res.status(404).send('Invalid request');
      } else{
        res.status(200).send(response.body);
      }
    });
});