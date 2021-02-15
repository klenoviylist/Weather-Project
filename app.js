require('dotenv').config();

const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.get("/", function(req, res) {
 res.sendFile(__dirname + "/index.html");
});

app.post("/", function(req, res) {
  const query = req.body.cityName;
  const apiKey = process.env.API_KEY;
  const units = "metric";

  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units=" + units;

  https.get(url, function(response) {
    console.log(response.statusCode);

    response.on("data", function(data) {
     const weatherData = JSON.parse(data);
     const temp = weatherData.main.temp;
     const feelsLike = weatherData.main.feels_like;
     const humidity = weatherData.main.humidity;
     const wind = weatherData.wind.speed;
     const description = weatherData.weather[0].description;
     const weatherImage = weatherData.weather[0].icon;
     const imageURL = "http://openweathermap.org/img/wn/" + weatherImage + "@2x.png";
     res.write("<h1>The temperature in " + query + " is " + temp + "&degC</h1>");
     res.write("<h1>Feels like: " + feelsLike +"&degC</h1>");
     res.write("<h1>Humidity: " + humidity + "%</h1>");
     res.write("<h1>Wind: " + wind + " km/h");
     res.write("<h1>" + description + ".</h1>");
     res.write("<image src =" + imageURL + ">");
     res.send();

     });
  });
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000");
});
