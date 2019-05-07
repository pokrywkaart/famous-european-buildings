"use strict";

var elem = document.querySelector('.main-carousel');
var restartButton = document.getElementById("btn-restart");
var progressBar = document.querySelector('.progress-bar');
var infos = document.getElementById("infos");
var mapCoordinates = [];
var carouselContainer = document.getElementById("main-carousel");
var carouselElement = document.getElementById("cities-array-element").innerHTML;
Mustache.parse(carouselElement);

function carouselBuilder() {
  for (var i = 0; i < citiesArray.length; i++ ){
    var div = document.createElement("div");
    div = Mustache.render(carouselElement, citiesArray[i]); 
    carouselContainer.insertAdjacentHTML('beforeend', div);     
  }
}
carouselBuilder();

var flkty = new Flickity( elem, { 
  cellAlign: 'left',
  contain: true,
  hash: true
});

function goToBeginning() {
    flkty.select( 0, false, true );
}
restartButton.addEventListener("click", goToBeginning);

flkty.on( 'scroll', function(progress) {
    progress = Math.max( 0, Math.min( 1, progress ) );
    progressBar.style.width = progress * 100 + '%';
});


// Initialize and add the map
window.initMap = function() {
    // LOCATION
    function createArraywWithCooridinates() {
        for (var i = 0; i < citiesArray.length; i++) {   
        var mapCoordinate = citiesArray[i].coords;
        mapCoordinates.push(mapCoordinate);
        };  
        return mapCoordinates;
    };
    createArraywWithCooridinates();

    var paris = mapCoordinates[0];

    // MAP
    var map = new google.maps.Map(
        document.getElementById('map'), {
            zoom: 7, 
            center: paris
    });

    // MARKER
    function rewind(index) {
        flkty.select( index, true, true );    
    };  

    function registerMarkerListener(marker, index ) {
        marker.addListener("click", function() {
            rewind(index);
        });
    }
    
    function addMarkersForCoordinates() {
        for(var i = 0; i < mapCoordinates.length; i++) {
            var mapCoordinate = mapCoordinates[i];
            var marker = new google.maps.Marker({
                position: mapCoordinate, 
                map: map
            });
            registerMarkerListener(marker, i);
        } 
    };
    addMarkersForCoordinates();

    flkty.on( 'change', function(index) {
        for (var i = 0; i < mapCoordinates.length; i++){
            var coordinate = mapCoordinates[index];
            map.panTo(coordinate);
            map.setZoom(7);
        }
        return coordinate; 
     });
    
    document.getElementById("center-map").addEventListener("click", function(event) {
        event.preventDefault();
        map.setZoom(10);
    });

   
    

    // document.getElementById("center-smooth").addEventListener("click", function(event) {
    //     event.preventDefault();
    //     smoothPanAndZoom(map, 7, paris);
    // });
    
    // var smoothPanAndZoom = function(map, zoom, coords){
	// 	// Trochę obliczeń, aby wyliczyć odpowiedni zoom do którego ma oddalić się mapa na początku animacji.
	// 	var jumpZoom = zoom - Math.abs(map.getZoom() - zoom);
	// 	jumpZoom = Math.min(jumpZoom, zoom -1);
	// 	jumpZoom = Math.max(jumpZoom, 3);

	// 	// Zaczynamy od oddalenia mapy do wyliczonego powiększenia. 
	// 	smoothZoom(map, jumpZoom, function(){
	// 		// Następnie przesuwamy mapę do żądanych współrzędnych.
	// 		smoothPan(map, coords, function(){
	// 			// Na końcu powiększamy mapę do żądanego powiększenia. 
	// 			smoothZoom(map, zoom); 
	// 		});
	// 	});
	// };
	
	// var smoothZoom = function(map, zoom, callback) {
	// 	var startingZoom = map.getZoom();
	// 	var steps = Math.abs(startingZoom - zoom);
	// 	// Jeśli steps == 0, czyli startingZoom == zoom
	// 	if(!steps) {
	// 		// Jeśli podano trzeci argument
	// 		if(callback) {
	// 			// Wywołaj funkcję podaną jako trzeci argument.
	// 			callback();
	// 		}
	// 		// Zakończ działanie funkcji
	// 		return;
	// 	}

	// 	// Trochę matematyki, dzięki której otrzymamy -1 lub 1, w zależności od tego czy startingZoom jest mniejszy od zoom
	// 	var stepChange = - (startingZoom - zoom) / steps;

	// 	var i = 0;
	// 	// Wywołujemy setInterval, który będzie wykonywał funkcję co X milisekund (X podany jako drugi argument, w naszym przypadku 80)
	// 	var timer = window.setInterval(function(){
	// 		// Jeśli wykonano odpowiednią liczbę kroków
	// 		if(++i >= steps) {
	// 			// Wyczyść timer, czyli przestań wykonywać funkcję podaną w powyższm setInterval
	// 			window.clearInterval(timer);
	// 			// Jeśli podano trzeci argument
	// 			if(callback) {
	// 				// Wykonaj funkcję podaną jako trzeci argument
	// 				callback();
	// 			}
	// 		}
	// 		// Skorzystaj z metody setZoom obiektu map, aby zmienić powiększenie na zaokrąglony wynik poniższego obliczenia
	// 		map.setZoom(Math.round(startingZoom + stepChange * i));
	// 	}, 80);
	// };

	// // Poniższa funkcja działa bardzo podobnie do smoothZoom. Spróbuj samodzielnie ją przeanalizować. 
	// var smoothPan = function(map, coords, callback) {
	// 	var mapCenter = map.getCenter();
	// 	coords = new google.maps.LatLng(coords);

	// 	var steps = 12;
	// 	var panStep = {lat: (coords.lat() - mapCenter.lat()) / steps, lng: (coords.lng() - mapCenter.lng()) / steps};

	// 	var i = 0;
	// 	var timer = window.setInterval(function(){
	// 		if(++i >= steps) {
	// 			window.clearInterval(timer);
	// 			if(callback) callback();
	// 		}
	// 		map.panTo({lat: mapCenter.lat() + panStep.lat * i, lng: mapCenter.lng() + panStep.lng * i});
	// 	}, 1000/30);
	// }; 
  }

	

