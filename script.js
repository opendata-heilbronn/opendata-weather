const imageStatusMap = {};
const dateOutput = document.getElementById("dateText");
mapboxgl.accessToken = 'pk.eyJ1Ijoibml0ZWdhdGUiLCJhIjoiY2l4ejFxc2d6MDA1aDJxbzc5bjZrMzI0ZyJ9.EEPEOLNhdFz9DVNx4TCvBw';
let counter = 0;
const dateFilePattern = /rainradar_(\d\d\d\d)(\d\d)(\d\d)_(\d\d)(\d\d)\d\d.*/;
let totalImages = 0;
let selectedHours = 4;
/*let imageBounds = L.latLngBounds([
    [46.95257828070096, 3.5889323545584633],
    [54.74054512217148, 15.72075796095801]
]);*/

var imageBounds = new mapboxgl.LngLatBounds([3.5889323545584633, 46.95257828070096],
    [15.72075796095801, 54.74054512217148]);


let map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v8',
    zoom: 5,
});
map.fitBounds(imageBounds);


map.on("load", function () {
    console.log("map loaded");
    fetchNewData(fetchUrl).then((files) => {
        totalImages = files.length;
        const imageStatus = document.getElementById('imageStatus');
        files.forEach((file) => {
            const statusDiv = document.createElement("div");
            statusDiv.classList.add("image-holder");
            imageStatus.appendChild(statusDiv);
            imageStatusMap[file] = {element: statusDiv};
        });
        preloadImages(files, 0);
    });
});

//map.removeControl(map.zoomControl);


//var overlay = L.imageOverlay("https://grundid.de/data/weather/rainradar_20180315_000001.png", imageBounds)
//    .addTo(map);


function preloadImages(files, index) {
    if ((files.length > index)) {
        const newFile = files[index];
        console.log("loading: ", newFile);
        const downloadingImage = new Image();
        downloadingImage.src = "https://grundid.de/data/weather/" + newFile;
        downloadingImage.onload = function () {

            const statusDiv = imageStatusMap[newFile].element;
            statusDiv.classList.add("image-loaded");
            /*        const matches = dateFilePattern.exec(newFile);
                    if (matches) {
                        dateOutput.innerHTML = matches[4] + ":" + matches[5] + " - " + matches[3] + "." + matches[2] + "." + matches[1];
                    }
                    overlay.setUrl("https://grundid.de/data/weather/" + newFile);
                    setTimeout(loadNextImage, waitTime);*/

            map.addLayer({
                id: 'radar' + index,
                source: {
                    type: 'image',
                    url: "https://grundid.de/data/weather/" + newFile,
                    coordinates: [
                        [3.5889323545584633,54.74054512217148 ],
                        [15.72075796095801, 54.74054512217148],
                        [15.72075796095801, 46.95257828070096 ],
                        [3.5889323545584633,  46.95257828070096 ],
                        
                    ]
                },
                type: 'raster',
                paint: {
                    'raster-opacity': 0,
                    'raster-opacity-transition': {
                        duration: 0
                    }
                }
            });

            preloadImages(files, ++index);

        };
        downloadingImage.onerror = function () {
            preloadImages(files, ++index);
        }
    } else {
        var frame = totalImages - 1;
        setInterval(function() {
            map.setPaintProperty('radar' + frame, 'raster-opacity', 0);
            frame = (frame + 1) % totalImages;
            map.setPaintProperty('radar' + frame, 'raster-opacity', 1);
        }, 200);
    }
}

let fetchUrl = 'https://grundid.de/data/weather/files4.json?time=';

function fetchNewData(url) {
    return fetch(url + Date.now())
        .then(function (response) {
            console.log(response);
            return response.json();
        });
}


/*
setInterval(fetchNewData, 5 * 60 * 1000);
fetchNewData(fetchUrl).then(() => {
  setTimeout(loadNextImage, 100);
});
*/
/*
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
*/