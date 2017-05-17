# -*- coding: utf-8 -*-

from BaseHTTPServer import BaseHTTPRequestHandler, HTTPServer
import SocketServer
import Adafruit_DHT
import serial
import time
import threading
import json


# Class for polling values at given interval (in seconds)
class Value_poller():
    def __init__(self, interval=10):
        # Initialize values dictionary with standard values
        self.values = {'co2': 400, 'temperature': 20, 'humidity': 40}
        # Set interval
        self.interval = interval

    def start(self):
        # Start loop
        self.poll_loop()

    def poll_loop(self):
        # Read co2 value from sensor
        co2 = co2_sensor.read_co2_level()
        # Read humidity and temperature from sensor
        humidity, temperature = dht_sensor.read_th()

        # Assign values to dictionary
        self.values['co2'] = co2
        self.values['humidity'] = round(humidity, 1)
        self.values['temperature'] = round(temperature, 1)
        # print('CO2: {} ppm, Temperature: {}°C, Humidity: {}'.format(co2, temperature, humidity))

        # Set interval timer
        threading.Timer(self.interval, self.poll_loop).start()

# Class for handling incoming HTTP requests
class Request_handler(BaseHTTPRequestHandler):
    def _set_headers(self):
        # Send 'OK' header
        self.send_response(200)

        # Set content type to 'text/html'
        self.send_header('Content-type', 'text/html')
        # Disable access control -> needed when running locally
        self.send_header('Access-Control-Allow-Origin', 'null')
        self.end_headers()

    def do_GET(self):
        self._set_headers()
        # Encode values dictionary as json
        values_json = json.dumps(value_poller.values)
        # Send values json
        self.wfile.write(values_json)

    def do_HEAD(self):
        self._set_headers()

    def do_POST(self):
        # Doesn't do anything with posted data...
        self._set_headers()
        # Encode values dictionary as json
        values_json = json.dumps(value_poller.values)
        # Send values json
        self.wfile.write(values_json)

# Class for handling co2 sensor reading process
class  Co2_sensor:
    def  __init__(self):
        # Initialize serial port
        self.ser = serial.Serial("/dev/serial0")
        # Flush serial buffer
        self.ser.flushInput()

    def read_co2_level(self):
        # Send read command
        self.ser.write("\xFE\x44\x00\x08\x02\x9F\x25")
        # Wait for answer
        time.sleep(.01)
        # Read 7 bytes from serial port
        response = self.ser.read(7)
        # co2 is 16 bit integer encoded in byte [3] and [4] of the response
        high = ord(response[3])
        low = ord(response[4])
        # build co2 value from high and low byte
        co2 = (high * 256) + low

        return co2

# Class for handling DHT sensor process
class Dht_sensor:
    def __init__(self, sensor_type='22', pin=18):
        # Dictionary with different sensor types
        sensor_args = { '11': Adafruit_DHT.DHT11,
                        '22': Adafruit_DHT.DHT22,
                        '2302': Adafruit_DHT.AM2302 }

        if sensor_type in sensor_args:
            self.sensor_type = sensor_args[sensor_type]
        else:
            self.sensor_type = sensor_args['22']

        # Assign pin to class
        self.pin = pin

    def read_th(self):
        # Read humidity and temperature from sensor
        humidity, temperature = Adafruit_DHT.read_retry(self.sensor_type, self.pin)

        if humidity is not None and temperature is not None:
            # print('Temp={0:0.1f}*  Humidity={1:0.1f}%'.format(temperature, humidity))
            return humidity, temperature
        else:
            print('DHT sensor reading failed.')
            return 40, 20

# Function for setting up http server
def run_server(server_class=HTTPServer, handler_class=Request_handler, port=8080):
    server_address = ('', port)
    httpd = server_class(server_address, handler_class)
    print 'Starting http server...'
    httpd.serve_forever()


if __name__ == "__main__":

    # Construct global co2 sensor instance
    co2_sensor = Co2_sensor()

    # Construct global dht sensor instance
    dht_sensor = Dht_sensor()

    # Construct global value_poller instance
    value_poller = Value_poller(interval=15)

    # Start polling values
    value_poller.start()

    # Run server
    run_server()
