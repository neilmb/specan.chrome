chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('window.html', {
    'outerBounds': {
      'width': 800,
      'height': 600
    },
    id: 'SpecanID'
  });
});

chrome.runtime.onSuspend.addListener(function() {
  // Close the serial port?
});
