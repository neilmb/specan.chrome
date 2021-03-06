/* Copyright 2016 Neil Martinsen-Burrell <neilmartinsenburrell@gmail.com>
 *
 * This file is part of Specan.chrome.
 *
 * Specan.chrome is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Specan.chrome is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Specan.chrome.  If not, see <http://www.gnu.org/licenses/>.
 */

const serial = chrome.serial;

const INITIAL_FREQUENCY = 14150000;

var connectedId = null;
var frequency = INITIAL_FREQUENCY;

var from_freq_init = 4.0;
var to_freq_init = 25.0;
var step_size_init = 500;

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
  document.getElementById('plotly_sandbox').contentWindow.postMessage(
    { command: 'plot',
      readings: readings }, '*');
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

  // Get parameters for this sweep
  from_frequency = (Number(document.getElementById('from_freq').value)*1000000).toFixed(0);
  to_frequency = (Number(document.getElementById('to_freq').value)*1000000).toFixed(0);
  step_size = (Number(document.getElementById('step_size').value)*1000).toFixed(0);

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
  // Fill sweep parameter defaults
  document.getElementById('from_freq').value = from_freq_init;
  document.getElementById('to_freq').value = to_freq_init;
  document.getElementById('step_size').value = step_size_init;
}

addEventListener('DOMContentLoaded', function () {
  document.querySelector('#connect').addEventListener('click', connect);
  document.querySelector('#sweep').addEventListener('click', sweep);

  main();
});
