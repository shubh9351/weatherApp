//js
const express = require('express');
const bodyParser = require('body-parser');
const https = require('https')
const app = express();

const port = 3000;
// to handle formdata from post request we use body-parser to parse the request
app.use(bodyParser.urlencoded({extended: true}));

// below line help us to use public folder in project
app.use(express.static(__dirname + '/public'));


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
});

app.post('/getTempData', (req, res) => {
    // console.log("Req body", req.body);
    console.log("Req json body", JSON.stringify(req.body));
    const key = "fb622ef1bb838ee6008cf61b968d02f5";
    var city = req?.body?.cityName;
    var url = "https://api.openweathermap.org/data/2.5/weather?q= " + city + "&appid="+ key +"&units=metric";

    https.get(url, (resp) => {
        console.log("Status code", resp.statusCode);
        resp.on("data", (data) => {
            // console.log("resp on", data)
            // above response will be in hex encoding <Buffer 7b 22 63 6f 6f 72 64 22 3 6c 61 74 22  5b ... 408 more bytes>
            // we can create by using Buffer in node.js
            const respData = JSON.parse(data);
            //two ways fo creating objects with limited data(use any one)

            //1 by function & passing data as argument
            const newData = initiData(respData, city);
            console.log("new data", newData);

            //2nd by TempratureData class
            const tempData = new TempratureData(respData, city);
            console.log("temp data", tempData);

            res.write("<h1> The temprature in " + city + " is " + newData.temp + " degrees celcius </h1>");
            res.write("<img src=" + newData.imageUrl + ">")
            res.write("<p>Weather condition is " + newData.description + "</p>");
            res.write("<p>humidity is " + newData.humidity + "</p>");
            res.send();
        })
    });
})


function initiData(data, city) {
    const tempData = {
        city: city,
        temp: data?.main.temp,
        imageUrl: "http://openweathermap.org/img/wn/"+ data?.weather[0].icon +"@2x.png",
        humidity: data?.main.humidity,
        description: data?.weather[0].description,
        pressure: data?.main.pressure
    }
    return tempData;
}

class TempratureData {
    constructor(jsonObj, city){
        this.city = city
        this.temp = jsonObj?.main.temp,
        this.imageUrl = "http://openweathermap.org/img/wn/"+ jsonObj?.weather[0].icon +"@2x.png",
        this.humidity = jsonObj?.main.humidity,
        this.description = jsonObj?.weather[0].description,
        this.pressure = jsonObj?.main.pressure
    }
}


app.listen(port, ()=>{
    console.log("Server is listening to port 3000");
});