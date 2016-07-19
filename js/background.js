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
