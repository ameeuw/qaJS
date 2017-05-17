#!/bin/sh

if $1 == 'pyserver'; then
  sudo /usr/bin/python /home/pi/qaJS/python/server.py
else
  /usr/local/bin/node /home/pi/qaJS/node/server.js dht co2 &
fi

/usr/bin/chromium-browser --noerrdialogs --disable-translate --kiosk --incognito /home/pi/qaJS/index.html &
