chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('window.html', {
    'outerBounds': {
      'width': 970,
      'height': 700
    },
    id: 'SpecanID'
  });
});

chrome.runtime.onSuspend.addListener(function() {
  // Close the serial port?
});
