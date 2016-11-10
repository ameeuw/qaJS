

Disable console on serial port:

`sudo raspi-config`

--> Expand Filesystem
--> Advanced Options
--> Serial --> <No>

`dmesg | grep tty`

If `ttyAMA0` does not show up, re-enable serial port:

`sudo nano /boot/config.txt`

Add (or uncomment) the line:
`enable_uart=1`

Update and upgrade system packages:

`sudo apt-get update`
`sudo apt-get upgrade`

Install chromium-browser:

`sudo apt-get install chromium-browser`

Install nodejs and npm:

`sudo apt-get install nodejs npm`
`sudo npm install -g n`
`sudo n 6.9.1`
`sudo npm install -g npm@latest`

Clone git repository:

git clone https://github.com/ameeuw/qaJS

Install nodejs dependences:

`cd qaJS`

https://github.com/momenso/node-dht-sensor

Install bcm2835:
`cd install`
`tar zxvf bcm2835-1.xx.tar.gz`
`cd bcm2835-1.xx`
`./configure`
`make`
`sudo make check`
`sudo make install`

`cd node`
`npm install node-dht-sensor`
`npm install serialport`

Autostart:

`node server.js co2 dht`
`chromium-browser --disable-translate --kiosk --incognito index.html`
