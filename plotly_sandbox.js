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
          l: 90,
          r: 10,
          b: 80,
          t: 20,
          pad: 4
        }
      };
      Plotly.purge('graphics');
      Plotly.newPlot('graphics', [trace], layout);
  }
});
