TODO: RAUSFINDEN WIE SCURVE FUNKTIONIERT UND NACHIMPLEMENTIEREN!

public double scurve(MeasurementParameter p, boolean negateRange) {
  e range = negateRange ? -p.getRange() : p.getRange();
  double sValue = (255 / (1 + Math
      .pow(E,
          ((-1) * p.getPitch() * (p.getValue() - (p.getTarget() + range))))));
  return (negateRange) ? 255 - sValue : sValue;
}



// Blaue lippen wenn es temp <= 20 ist.
if (temperature <= targetTemperature)
{
  var lipscoldIntensity = scurve(temperature, false);
}
else
{ // Gelbe lippen für temp über 20.
  var lipscoldIntensity = scurve(temperature, false);
  image(lipswarm, lipsx, lipsy);
}
lastTemp = temperature;


if (humidity <= targetHumidity)
{ // Cracks auf der Haut für Luftfeuchtigkeit
  // unter 50 (default).
  var cracksIntensity = scurve(humidity, true);
}
else
{ // nasse Haut
  var dropsIntensity = scurve(humidity, false) / 2;
}
lastHum = humidity;


var greenskinIntensity = scurve(manipulate.co2, false));
lastCo2 = co2;
