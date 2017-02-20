const http = require('http');

var settings = {
  dhtType : 22,
  dhtPin : 25,
  serialPort : "/dev/ttyAMA0"
}

var gTemperature = 22;
var gHumidity = 48;
var gCo2 = 400;

if (process.argv[2] !== undefined)
{
  if (process.argv[2] == "co2")
  {
    console.log("Initializing co2 sensor")
    initCo2();
  }
  else
  {
    if (process.argv[2] == "dht")
    {
      console.log("Initializing dht sensor")
      initDht();
    }
    else
    {
      console.log("Starting withouth sensors...")
    }
  }

  if (process.argv[3] !== undefined)
  {
    if (process.argv[3] == "co2")
    {
      console.log("Initializing co2 sensor")
      initCo2();
    }
    else
    {
      if (process.argv[3] == "dht")
      {
        console.log("Initializing dht sensor")
        initDht();
      }
      else
      {
        console.log("Starting withouth sensors...")
      }
    }

  }

}
else
{
  console.log("Starting withouth sensors...")
}

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
  const dht = require('node-dht-sensor');

  setInterval(function(){
    dht.read(settings.dhtType, settings.dhtPin, function(err, temperature, humidity) {
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
  const serial = require('serialport');

  var port = new serial(settings.serialPort, {
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
