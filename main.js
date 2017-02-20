/*
 *
 *
 *
 */

var settings = {
  host : "http://localhost:8080",
  updateInterval : 15
}

var parameters = {
  temperature : {
    value : 20,
    range : 5,
    target : 22,
    pitch : 0.3
  },
  humidity : {
    value : 50,
    range : 18,
    target : 40,
    pitch : 0.3
  },
  co2 : {
    value : 400,
    range : 1200,
    target : 400,
    pitch : 0.003
  }
}

// Create image HTML object for head
var head = new Image();
head.src = "img/head.png";

// Create image HTML object for warm lips
var cracks = new Image();
cracks.src = "img/cracks.png"

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

// Run XMLHttpRequest to fetch new parameters from nodejs sensor application
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
          parameters.temperature.value = valueJSON.temperature;
        }
        if (valueJSON.humidity !== undefined)
        {
          parameters.humidity.value = valueJSON.humidity;
        }
        if (valueJSON.co2 !== undefined)
        {
          parameters.co2.value = valueJSON.co2;
        }

        // Apply scaling function to values
        scaleValues(valueJSON, function() {
          // Redraw canvas
          console.log("CALLBACK");
        });
      }
  }
  http.open("POST", settings.host, true);
  http.send();
}

/*
 *
 *
 */

function scaleValues(currentValues, callback)
{
  var lipscoldIntensity=0, lipswarmIntensity=0, dropsIntensity=0, cracksIntensity=0, greenskinIntensity=0;

  if (currentValues.temperature <= parameters.temperature.target)
  {
    lipscoldIntensity = sCurve(currentValues.temperature, parameters.temperature, true);
  }
  else
  {
    lipswarmIntensity = sCurve(currentValues.temperature, parameters.temperature, false);
  }
  parameters.temperature.value = currentValues.temperature;

  if (currentValues.humidity <= parameters.humidity.target)
  {
    cracksIntensity = sCurve(currentValues.humidity, parameters.humidity, true);
  }
  else
  {
    dropsIntensity = sCurve(currentValues.humidity, parameters.humidity, false) / 2;
  }
  parameters.humidity.value = currentValues.humidity;

  greenskinIntensity = sCurve(currentValues.co2, parameters.co2, false);
  parameters.co2.value = currentValues.co2;

  console.log('co2 : ' + currentValues.co2 + 'ppm');
  console.log('temperature : ' + currentValues.temperature + '°C');
  console.log('humidity: ' + currentValues.humidity + '%');
  console.log('lipscoldIntensity : ' + lipscoldIntensity);
  console.log('lipswarmIntensity : ' + lipswarmIntensity);
  console.log('cracksIntensity: ' + cracksIntensity);
  console.log('dropsIntensity: ' + dropsIntensity);
  console.log('greenskinIntensity: ' + greenskinIntensity);

  redrawCanvas(lipscoldIntensity, lipswarmIntensity, cracksIntensity, dropsIntensity, greenskinIntensity);
}

function sCurve(value, params, negateRange)
{
  var range = (negateRange) ? -params.range : params.range;
  var sValue = ( 255 / ( 1 + Math.exp( (-1) * params.pitch * (value - (params.target + params.range)) ) ) );
  return (negateRange) ? (255 - sValue) : sValue;
}

function redrawCanvas(lipscoldIntensity, lipswarmIntensity, cracksIntensity, dropsIntensity, greenskinIntensity)
{

  context.clearRect(0, 0, canvas.width, canvas.height);

  context.globalAlpha = 1;
  context.fillStyle = "#e25a10";
  context.fillRect(0,0,canvas.width, canvas.height);

  context.globalAlpha = 1;
  context.globalCompositeOperation = "source-over";
  context.drawImage(head, 0, 0, canvas.width, canvas.height);

  context.globalCompositeOperation = "hard-light";
  context.globalAlpha = cracksIntensity / 255;
  context.drawImage(cracks, 0, 0, canvas.width, canvas.height);

  context.globalCompositeOperation = "hard-light";
  context.globalAlpha = dropsIntensity / 255;
  context.drawImage(drops, 0, 0, canvas.width, canvas.height);

  context.globalCompositeOperation = "hard-light";
  context.globalAlpha = greenskinIntensity / 255;
  context.drawImage(greenskin, 0, 0, canvas.width, canvas.height);

  context.globalCompositeOperation = "source-over";
  context.globalAlpha = lipscoldIntensity / 255;
  context.drawImage(lipscold, 0, 0, canvas.width, canvas.height);

  context.globalCompositeOperation = "source-over";
  context.globalAlpha = lipswarmIntensity / 255;
  context.drawImage(lipswarm, 0, 0, canvas.width, canvas.height);

  var baseX = 30;
  var baseY = 800;
  var yStep = 60
  drawText("Temperature: " + parameters.temperature.value.toFixed(2) +  String.fromCharCode(176) + "C", baseX, baseY + yStep);
  drawText("Humidity: " + parameters.humidity.value.toFixed(2) + " %", baseX, baseY + 2 * yStep);
  drawText("CO2: " + parameters.co2.value.toFixed(2) + " ppm", baseX, baseY + 3 * yStep);
}

function drawText(text, x, y)
{
  context.globalAlpha = 1;
  context.fillStyle = "white";
  context.strokeStyle = "black";
  context.lineWidth = 4;
  context.font = "40px Arial";
  context.strokeText(text, x, y);
  context.fillText(text, x, y);
}
