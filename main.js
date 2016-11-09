/*
 *
 *
 *
 */

var values = {
  temperature : [
    value : 20,
    range : 5,
    target : 22,
    pitch : 0.3
  ],
  humidity : [
    value : 50,
    range : 18,
    target : 48,
    pitch : 0.3
  ],
  co2 : [
    value : 400,
    range : 1200,
    target : 400,
    pitch : 0.003
  ]
}



static final double Hum_Target_INIT = 48;
static final double Hum_Range_INIT = 18;


static final double Hum_Pitch_INIT = 0.3;


e

// Create image HTML object for head
var head = new Image();
head.src = "img/head.png";

// Create image HTML object for warm lips
var cracks = new Image();
lipswarm.src = "img/cracks.png"

// Create image HTML object for head
var drops = new Image();
drops.src = "img/drops.png";

// Create image HTML object for green skin
var greenskin = new Image();
greenskin.src = "img/greenskin.png";

// Create image HTML object for cold lips
var lipscold = new Image();
lipscold.src = "img/lipscold.png"

// Create image HTML object for warm lips
var lipswarm = new Image();
lipswarm.src = "img/lipswarm.png"

// Create global objects for canvas and context
var canvas, context;

// Start when DOM is loaded
document.addEventListener("DOMContentLoaded", function(event) {
  canvas = document.getElementById('qaCanvas');
  context = canvas.getContext('2d');
});

// Run XMLHttpRequest to fetch new values from nodejs sensor application
function fetchValues()
{
  if (window.XMLHttpRequest)
  {// code for IE7+, Firefox, Chrome, Opera, Safari
    http=new XMLHttpRequest();
  }
  http.onreadystatechange=function()
  {
      if (http.readyState==4 && http.status==200)
      {
        // console.log(http.responseText);
        // Parse incoming JSON string
        var valueJSON = JSON.parse(http.responseText);

        if (valueJSON.temperature !== undefined)
        {
          values.temperature.value = valueJSON.temperature;
        }
        if (valueJSON.humidity !== undefined)
        {
          values.humidity.value = valueJSON.humidity;
        }
        if (valueJSON.co2 !== undefined)
        {
          values.co2.value = valueJSON.co2;
        }

        // Apply scaling function to values
        scaleValues(valueJSON, function() {
          // Redraw canvas

        });
      }
  }
  http.open("POST","http://192.168.1.121:8080",true);
  http.send();
}

function scaleValues(valueJSON, callback)
{
  console.log("redrawing");
  var greenskinIntensity = valueJSON.co2 / 2000;
  console.log(greenskinIntensity)
  redrawComposition(0, greenskinIntensity, 0, 0);
  var lipscoldIntensity, lipswarmIntensity, dropsIntensity, cracksIntensity, greenskinIntensity;

  if (valueJSON.temperature <= values.temperature.target)
  {
    lipscoldIntensity = sCurve(valueJSON.temperature, false);
  }
  else
  {
    lipswarmIntensity = sCurve(valueJSON.temperature, false);
  }
  values.temperature.value = valueJSON.temperature;

  if (valueJSON.humidity <= values.humidity.target)
  {
    cracksIntensity = sCurve(valueJSON.humidity, true);
  }
  else
  {
    dropsIntensity = sCurve(valueJSON.humidity, false) / 2e
  }
  values.humidity.value = valueJSON.humidity;

  greenskinIntensity = sCurve(valueJSON.co2, false);
  values.co2.value = valueJSON.co2;

  console.log('co2 : ' + valueJSON.co2 + 'ppm');
  console.log('temperature : ' + valueJSON.temperature + '°C');
  console.log('humidity: ' + valueJSON.humidity + '%');
  console.log('lipscoldIntensity : ' + lipscoldIntensity);
  console.log('lipswarmIntensity : ' + lipswarmIntensity);
  console.log('cracksIntensity: ' + cracksIntensity);
  console.log('dropsIntensity: ' + dropsIntensity);
  console.log('greenskinIntensity: ' + greenskinIntensity);
}

function sCurve(value, range, pitch, target, negateRange)
{
  var range = (negateRange) ? -range : range;
  var sValue = (255 / 1 + Math.exp( (-1) * pitch * (value - (target + range)) );
  return (negateRange) ? 255 - sValue : sValue;
}

function redrawComposition(lipscoldIntensity, lipswarmIntensity, cracksIntensity, dropsIntensity, greenskinIntensity)
{
  context.clearRect(0, 0, canvas.width, canvas.height);

  context.globalAlpha = 1;
  context.fillStyle = "#e25a10";
  context.fillRect(0,0,canvas.width, canvas.height);

  context.globalAlpha = 1;
  context.globalCompositeOperation = "source-over";
  context.drawImage(head, 0, 0, canvas.width, canvas.height);

  context.globalCompositeOperation = "hard-light";
  context.globalAlpha = cracksIntensity;
  context.drawImage(cracks, 0, 0, canvas.width, canvas.height);

  context.globalCompositeOperation = "hard-light";
  context.globalAlpha = dropsIntensity;
  context.drawImage(drops, 0, 0, canvas.width, canvas.height);

  context.globalCompositeOperation = "hard-light";
  context.globalAlpha = greenskinIntensity;
  context.drawImage(greenskin, 0, 0, canvas.width, canvas.height);

  context.globalCompositeOperation = "source-over";
  context.globalAlpha = lipscoldIntensity;
  context.drawImage(lipscold, 0, 0, canvas.width, canvas.height);

  context.globalCompositeOperation = "source-over";
  context.globalAlpha = lipswarmIntensity;
  context.drawImage(lipswarm, 0, 0, canvas.width, canvas.height);
}
