#!/bin/sh

if [ $1 = "pyserver" ]; then
  echo "Starting python server"
  /usr/bin/python /home/pi/qaJS/python/server.py &
else
  echo "Starting nodejs server"
  /usr/local/bin/node /home/pi/qaJS/node/server.js dht co2 &
fi

/usr/bin/chromium-browser --noerrdialogs --disable-translate --kiosk --incognito /home/pi/qaJS/index.html &
