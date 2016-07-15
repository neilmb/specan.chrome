const serial = chrome.serial;

var connectedId = null;

function writeSerial(str) {
  console.log('Sending ' + str);
  serial.send(connectedId, convertStringToArrayBuffer(str), function(){});
}
// Convert string to ArrayBuffer
var convertStringToArrayBuffer=function(str) {
  var buf=new ArrayBuffer(str.length);
  var bufView=new Uint8Array(buf);
  for (var i=0; i<str.length; i++) {
    bufView[i]=str.charCodeAt(i);
  }
  return buf;
}
// Convert ArrayBuffer to string
function convertArrayBufferToString(buf){
  console.log('Buffer length');
  console.log(buf.byteLength);
  var bufView = new Uint8Array(buf);
  console.log('bufView:');
  console.log(bufView);
  var encodedString = String.fromCharCode.apply(null, bufView);
  console.log('encodedString:');
  console.log(encodedString);
  var returning = decodeURIComponent(escape(encodedString))
  console.log('returning:');
  console.log(returning);
  return returning;
}

var stringReceived = '';

function onReceiveCallback(info) {
  if (info.connectionId == connectedId && info.data) {
    var str = convertArrayBufferToString(info.data);
    console.log('Received string ' + str + ' of length ' + str.length);
    if (str.charAt(str.length-1) === '\n') {
      stringReceived += str.substring(0, str.length-1);
      onLineReceived(stringReceived);
      stringReceived = '';
    } else {
      stringReceived += str;
    }
  }
};
serial.onReceive.addListener(onReceiveCallback);

function onLineReceived(line) {
  console.log('Received line: ' + line);
}

function readDetector() {
  writeSerial('r\n');
}

function connect(e) {
  console.log('Connect clicked!');
  var path = document.getElementById('serialports').value
  serial.connect(path, { "bitrate": 115200 }, function(connectionInfo) {
    console.log('Connected with connection info:');
    console.log(connectionInfo);
    connectedId = connectionInfo.connectionId;
    writeSerial('i\n');
    setInterval(readDetector, 10000);
  });
  return true;
}

function sweep(e) {
  console.log('Sweep clicked!');
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
