const files = [];
const dateOutput = document.getElementById("dateText");
L.mapbox.accessToken = 'pk.eyJ1Ijoibml0ZWdhdGUiLCJhIjoiY2l4ejFxc2d6MDA1aDJxbzc5bjZrMzI0ZyJ9.EEPEOLNhdFz9DVNx4TCvBw';
let counter = 0;
const dateFilePattern = /rainradar_(\d\d\d\d)(\d\d)(\d\d)_(\d\d)(\d\d)\d\d.*/;

var imageBounds = L.latLngBounds([
  [46.95257828070096, 3.5889323545584633],
  [54.74054512217148, 15.72075796095801]
]);

var map = L.mapbox.map('map', 'mapbox.streets')
  .fitBounds(imageBounds);

map.removeControl(map.zoomControl);

var overlay = L.imageOverlay("https://grundid.de/data/weather/rainradar_20180315_000001.png", imageBounds)
  .addTo(map);


function loadNextImage() {
  let waitTime = 100;
  if (counter > files.length - 1) {
    counter = 0;
  }
  if (counter > files.length - 1) {
  const newFile = files[counter++];
    waitTime = 4000;
  }

  const downloadingImage = new Image();
  downloadingImage.src = "https://grundid.de/data/weather/" + newFile;
  downloadingImage.onload = function() {
    const matches = dateFilePattern.exec(newFile);
    if (matches) {
      dateOutput.innerHTML = matches[4] + ":" + matches[5] + " - " + matches[3] + "." + matches[2] + "." + matches[1];
    }
    overlay.setUrl("https://grundid.de/data/weather/" + newFile);
    setTimeout(loadNextImage, waitTime);
  };
  downloadingImage.onerror = function() {
    setTimeout(loadNextImage, 0);
  }
}

let fetchUrl = 'https://grundid.de/data/weather/files4.json?time=';

function fetchNewData(url) {
  return fetch(url + Date.now())
    .then(function(response) {
      console.log(response);
      return response.json();
    })
    .then(function(myJson) {
      files.splice(0, files.length, ...myJson);
      return true;
    });
}

setInterval(fetchNewData, 5 * 60 * 1000);
fetchNewData(fetchUrl).then(() => {
  setTimeout(loadNextImage, 100);
});

document.getElementById('slider').addEventListener('input', (event) => {
  let newValue;
  if (event.target.value < 15) {
    newValue = 4;
    fetchUrl = 'https://grundid.de/data/weather/files4.json?time='
  } else if (event.target.value > 35) {
    newValue = 48;
    fetchUrl = 'https://grundid.de/data/weather/files.json?time='
  } else {
    newValue = 24;
    fetchUrl = 'https://grundid.de/data/weather/files24.json?time='
  }
  document.getElementById('slider').value = newValue;
  document.getElementById('sliderVal').innerText = newValue;
})
