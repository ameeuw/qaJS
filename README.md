## [ quantifiedArt ] JS

### Introduction

This repository holds a reimplementation of the QuantifiedArt project developed at the __Bosch__ _Internet of Things Lab_ at University of St. Gallen and ETH Zürich.

We aim to provide a self installable, understandable solution that everyone with the right hardware can build for him- or herself.

The used software aims to be run on Single Board Computers (SBC) such as the Raspberry Pi and is built to be as minimal in processing demands as possible. The architecture is tested on a Raspberry Pi B+ Model 1.2 and is expected to work on any revision of this SBC (RPi 2 / 3 / zero).

For now the code supports DHT-type temperature and humidity sensors and works with K30 carbon dioxide sensor modules from SenseAir. We aim to provide support for other air parameter sensors in the future to keep this project being adapted by more and more people.

### Bill Of Materials

* 1 x Raspberry Pi B+ 1.2
* 1 x MicroSD-Card >= 8.0GB
* 1 x DHT-22 (AM2301) temperature and humidity sensor
* 1 x SenseAir k30 carbon dioxide sensor module
* 7 x Dupont wire jumpers
* 1 x Micro-USB cable
* 1 x HDMI display cable



### Wiring:

Connect the serial port of the k30 carbon dioxide sensor with the serial port of the raspberry pi:

#### k30 CO2 sensor:

pin RPi | function RPi | pin k30 | function k30
------- | ------------ | ------- | ------------
4 | vcc | 33 | vcc
6 | gnd | 32 | gnd
8 | tx | 34 | rx
10 | rx | 35 | tx

#### dht temperature & humidity sensor:

pin RPi | function RPi | color dht | function dht
------- | ------------ | --------- | ------------
2 | vcc | red | vcc
14 | gnd | black | gnd
25 | gpio | yellow | data

### Installation:

#### The easy way:

Transfer the image to the MicroSD-Card and put it in the corresponding slot in the Raspberry Pi.

#### Manual installation:

#### Disable console on serial port:

`sudo raspi-config`

--> Expand Filesystem

--> Advanced Options --> Serial --> < No >

`dmesg | grep tty`

If `ttyAMA0` does not show up, re-enable serial port:

`sudo nano /boot/config.txt`

Add, change or uncomment the line:
`enable_uart=1`

#### Update and upgrade system packages (could take a while...):

`sudo apt-get update && sudo apt-get upgrade -y`

`sudo apt-get dist-upgrade`

`sudo apt-get clean`

#### Install LXDE:

`sudo apt-get install --no-install-recommends xserver-xorg -y`

`sudo apt-get install --no-install-recommends xinit -y`

`sudo apt-get install lxde-core lxappearance -y`

`sudo apt-get install lightdm -y`

#### Install chromium-browser:

`sudo apt-get install chromium-browser -y`

#### Install nodejs and npm:

`sudo apt-get install nodejs npm -y`

`sudo npm install -g n`

`sudo n 6.9.1`

`sudo npm install -g npm@latest`

#### Install git and clone git repository:

`sudo apt-get install git -y`

`git clone https://github.com/ameeuw/qaJS`

#### Disable Screensaver:


`./qaJS/install/disableScreensaver.sh`

`< yes >` ... `< yes >`

#### Install nodejs dependences:

Additional infos:
* [node-dht-sensor](https://github.com/momenso/node-dht-sensor)

* [serialport](https://github.com/EmergingTechnologyAdvisors/node-serialport)

##### Install dependency _bcm2835_:
`cd install`
`tar zxvf bcm2835-1.xx.tar.gz`
`cd bcm2835-1.xx`
`./configure`
`make`
`sudo make check`
`sudo make install`

##### Install node packages:
`cd node`
`npm install node-dht-sensor`
`npm install serialport`

#### Create autostart entry at login:

`sudo nano ~/.config/lxsession/LXDE/autostart`

Add line:

`@/home/pi/qaJS/launch.sh`
