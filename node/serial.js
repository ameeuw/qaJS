var serial = require('serialport');

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
  console.log(returnJSON);
});
