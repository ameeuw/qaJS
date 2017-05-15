const http = require('http');

var settings = {
  dhtType : 22,
  dhtPin : 18, // GPIO18 -> PIN12
  serialPort : '/dev/serial0'
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
      console.log("Starting without sensors...")
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
        console.log("Starting without sensors...")
      }
    }

  }

}
else
{
  console.log("Starting without sensors...")
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
        // Temperature of DHT is off - subtract 1 because of heat-compensation
        gTemperature = temperature.toFixed(1) - 1;
        gHumidity = humidity.toFixed(1);
        // console.log('temp: ' + temperature.toFixed(1) + '°C');
        // console.log('humidity: ' + humidity.toFixed(1) + '%');
      }
    });
  }, 10005);
}

function initCo2()
{
  const serial = require('serialport');

  var port = new serial(settings.serialPort, {
    parser: serial.parsers.byteLength(7)
  });

  port.on('open', function() {
    console.log('Serial port opened.');
    setInterval(function(){
      port.write([0xFE, 0x44, 0x00, 0x08, 0x02, 0x9F, 0x25]);
    }, 10000);
  });

  port.on('data', function(data) {
    high_byte = data[3]
    low_byte = data[4]

    if ((typeof(high_byte) == 'number') && (typeof(low_byte) == 'number')) {
      var co2_value = 256 * high_byte + low_byte;
      if (co2_value < 10000) {
        // console.log('CO2_VALUE: ' + co2_value);
        gCo2 = co2_value;
      }
      else {
        console.log('Range error.');
      }
    }
    else {
      console.log('Type error.');
    }
  });
}
