#!/bin/sh

/usr/local/bin/node /home/pi/qaJS/node/server.js dht co2 &
/usr/bin/chromium-browser --disable-translate --kiosk --incognito /home/pi/qaJS/index.html &