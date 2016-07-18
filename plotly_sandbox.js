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
        width: 750,
        height: 550,
        margin: {
          l: 50,
          r: 50,
          b: 80,
          t: 20,
          pad: 4
        }
      };
      Plotly.plot('graphics', [trace], layout);
  }
});
