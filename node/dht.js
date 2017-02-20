var dht = require('node-dht-sensor');

dht.read(22, 25, function(err, temperature, humidity) {
  if (!err) {
    console.log('temp: ' + temperature.toFixed(1) + '°C');
    console.log('humidity: ' + humidity.toFixed(1) + '%');
  }
});
