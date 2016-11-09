const http = require('http');
const serial = require('serialport');
const dht = require('node-dht-sensor');

if (process.argv[2] == "22")
{
}
else
{
}

var gTemperature = 24;
var gHumidity = 45;
var gCo2 = 400;

initDht();
initCo2();

http.createServer(function (req, res) {
  var body = "";
  req.on('data', function (chunk) {
    body += chunk;
  });
  req.on('end', function () {

    var returnJSON = {
      temperature: gTemperature,
      humidity: gHumidity,
      co2: gCo2
    }

    console.log(returnJSON);

    res.writeHead(200, {'Access-Control-Allow-Origin': 'null'});
    res.end(JSON.stringify(returnJSON));
  });
}).listen(8080);

function initDht()
{
  setInterval(function(){
    dht.read(22, 25, function(err, temperature, humidity) {
      if (!err) {
        gTemperature = temperature.toFixed(1);
        gHumidity = humidity.toFixed(1);
        // console.log('temp: ' + temperature.toFixed(1) + '°C');
        // console.log('humidity: ' + humidity.toFixed(1) + '%');
      }
    });
  }, 10000);
}

function initCo2()
{
  var port = new serial('/dev/ttyAMA0', {
    parser: serial.parsers.readline('\n')
  });

  port.on('data', function(data) {
    var returnJSON = {};
    for (var element in data.split(", "))
    {
    	var key = data.split(", ")[element].split(" = ")[0];
    	var value = data.split(", ")[element].split(" = ")[1];
    	returnJSON[key] = value;
    }
    gCo2 = returnJSON.CO2;
    // console.log('co2: ' + gCo2 + 'ppm');
  });
}
