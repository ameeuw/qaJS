var serial = require('serialport');

var port = new serial('/dev/cu.usbserial-AH01LIMU', {
  parser: serial.parsers.byteLength(7)
  });

port.on('open', function() {
  console.log('Serial port opened.');
  setInterval(function(){
    port.write([0xFE, 0x44, 0x00, 0x08, 0x02, 0x9F, 0x25]);
  }, 500);
});

port.on('data', function(data) {
  high_byte = data[3];
  low_byte = data[4];

  if ((typeof(high_byte) == 'number') && (typeof(low_byte) == 'number')) {
    var co2_value = 256 * high_byte + low_byte;
    if (co2_value < 10000) {
      console.log('CO2_VALUE: ' + co2_value);
      var returnJSON = {};
      returnJSON['CO2'] = co2_value;
      console.log(returnJSON);
    }
    else {
      console.log('Range error.')
    }
  }
  else {
    console.log('Type error.')
  }
});
