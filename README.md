

Disable console on serial port:

`sudo raspi-config`
--> Advanced Settings
--> Serial Port
--> No


`sudo nano /boot/config.txt`

Add line
`enable_uart=1`


Node DHT Sensor:

https://github.com/momenso/node-dht-sensor

install bcm2835:

tar zxvf bcm2835-1.xx.tar.gz
cd bcm2835-1.xx
./configure
make
sudo make check
sudo make install


Autostart:

`node server.js co2 dht`
`chromium-browser --disable-translate --kiosk --incognito index.html`
