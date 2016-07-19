window.addEventListener('message', function(event) {
  var command = event.data.command,
      readings = event.data.readings,
      result = "invalid request";
  switch(command) {
    case 'plot':
      var x = [], y = [];
      for (i = 0; i < readings.length; i++) {
        x.push(readings[i][0]);
        y.push(readings[i][1]);
      }
      var trace = {
        x: x,
        y: y,
        type: 'scatter',
        mode: 'lines+markers'
      };
      var layout = {
        xaxis: {
          title: 'Frequency (MHz)'
        },
        yaxis: {
          title: 'Power Level (dBm)'
        },
        autosize: false,
        width: 720,
        height: 600,
        margin: {
          l: 50,
          r: 10,
          b: 80,
          t: 10,
          pad: 4
        }
      };
      Plotly.purge('graphics');
      Plotly.newPlot('graphics', [trace], layout);
  }
});
