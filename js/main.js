const serial = chrome.serial;

const INITIAL_FREQUENCY = 14150000;

var connectedId = null;
var frequency = INITIAL_FREQUENCY;

var from_frequency = 4000000;
var to_frequency = 12000000;
var step_size = 100000;

var sweep_readings = [];

function writeSerial(str) {
  serial.send(connectedId, convertStringToArrayBuffer(str), function(){});
}
// Convert string to ArrayBuffer
function convertStringToArrayBuffer(str) {
  var buf=new ArrayBuffer(str.length);
  var bufView=new Uint8Array(buf);
  for (var i=0; i<str.length; i++) {
    bufView[i]=str.charCodeAt(i);
  }
  return buf;
}
// Convert ArrayBuffer to string
function convertArrayBufferToString(buf) {
  var bufView = new Uint8Array(buf);
  var encodedString = String.fromCharCode.apply(null, bufView);
  return decodeURIComponent(escape(encodedString));
}

var stringReceived = '';

function onReceiveCallback(info) {
  if (info.connectionId == connectedId && info.data) {
    var str = convertArrayBufferToString(info.data);
    if (str.charAt(str.length-1) === '\n') {
      stringReceived += str.substring(0, str.length-1);
      onLineReceived(stringReceived);
      stringReceived = '';
    } else {
      stringReceived += str;
    }
  }
}
serial.onReceive.addListener(onReceiveCallback);

function onLineReceived(lines) {
  console.log('Received lines: ' + lines);
  $.each(lines.split('\n'), function(index, line) {
    switch(line[0]) {
      case "d":
        // detector reading as 10-bit integer
        updatePower(line.substring(1));
        break;
      case "b":
        // start of begin
        if (line == 'begin') {
          console.log('beginning sweep');
          doing_sweep = true;
          sweep_readings = [];
        } else {
          console.log('got b without begin');
        }
        break;
      case "r":
        // reading in sweep
        var freq_val = line.substring(1).split(':');
        sweep_readings.push([Number(freq_val[0])/1000000, Number(freq_val[1])/10]);
        break;
      case "e":
        // start of end
        if (line == 'end') {
          console.log('ending sweep');
          doing_sweep = false;
          console.log("Got " + sweep_readings.length + " readings");
        } else {
          console.log('got e without end');
        }
        plotReadings(sweep_readings);
        break;
      default:
        // no match
        console.log('No matching case for line: ' + line);
        break;
    }
  });
}

function updatePower(line) {
  // Farhan's analogRead to dBm curve from specan.exe
  document.getElementById('power').innerHTML = (Number(line) * 0.2 - 92).toFixed(1).toString() + ' dBm';
}

function plotReadings(readings) {
  $.plot('#graphics', [{data: readings}],
        {
          series: {
            lines: { show: true },
            points: { show: true }
          },
          xaxis: {
            ticks: 20
          },
          yaxis: {
            ticks: 10,
            min: -100,
            max: 0,
            tickDecimals: 0
          },
          grid: {
            backgroundColor: { colors: [ "#fff", "#eee" ] },
            borderWidth: {
              top: 1,
              right: 1,
              bottom: 2,
              left: 2
            }
          }
         }
       );
}

function readDetector() {
  writeSerial('r\n');
}

function setFrequency(freq) {
  frequency = freq;
  writeSerial('f' + freq.toString() + '\n');
}

function connect(e) {
  console.log('Connect clicked!');
  var path = document.getElementById('serialports').value
  serial.connect(path, { "bitrate": 9600 }, function(connectionInfo) {
    console.log('Connected with connection info:');
    console.log(connectionInfo);
    connectedId = connectionInfo.connectionId;

    // Set initial frequency
    setFrequency(INITIAL_FREQUENCY);
    setInterval(readDetector, 1000);
  });
  return true;
}

function sweep(e) {
  console.log('Sweep clicked!');
  setFrequency(from_frequency);
  writeSerial('t' + to_frequency.toString() + '\n');
  writeSerial('s' + step_size + '\n');
  writeSerial('g\n');
  return true;
}

function loadDevices(ports) {
  var selectBox = document.getElementById('serialports');
  $.each(ports, function(index, value) {
    var newOption = document.createElement('option')
    newOption.value = value.path;
    newOption.innerText = value.path;
    selectBox.appendChild(newOption);
  });
}

function main() {
  /* Load the serial devices */
  serial.getDevices(loadDevices);
}

addEventListener('DOMContentLoaded', function () {
  document.querySelector('#connect').addEventListener('click', connect);
  document.querySelector('#sweep').addEventListener('click', sweep);

  main();
});
