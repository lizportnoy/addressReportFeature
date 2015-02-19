// allows for display of map
L.mapbox.accessToken = 'pk.eyJ1IjoibGl6cG9ydDEwIiwiYSI6ImpsVWNHOEkifQ.Qjp0ZXU4vzfaMGLa8jJWoQ';
var map = L.mapbox.map('map', 'lizport10.kghhb1if');

var eventsLayer = L.mapbox.featureLayer().addTo(map);
var geojson = {
    type: 'FeatureCollection',
    features: []
};

eventsLayer.setGeoJSON(geojson);

eventsLayer.on('mouseover', function(e) {
    e.layer.openPopup();
});


eventsLayer.on('click', function(e) {
    e.layer.closePopup();
});

eventsLayer.on('layeradd', function(e) {
    var marker = e.layer,
        feature = marker.feature;

    // Create custom popup content
    var popupContent =  '<a target="_blank" class="popup" href="' + feature.properties.url + '">' +
                            '<img src="' + feature.properties.image + '" />' +
                            '<span class="title">' + feature.properties.title + ' @ </span>' + '<span class="venue">' + feature.properties.venue + '</span>' + 
                        '</a>';

    marker.bindPopup(popupContent,{
        closeButton: false,
        minWidth: 320
    });
});


// event listener for address submission
$('.submitButton').on('click', function (e) {
  e.preventDefault();
  var address = $('.address').val().split(' ').join('+');
  geocodeAddress(address);
  $('.address').val('');
});

// submission of address through geocoder
var geocodeAddress = function (address)  {
$.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + address +'&key=AIzaSyDoAwqku_zrO0HFxUi26JWDtLa0jHJmrQ0', function (geocodedAddress) {
    if (geocodedAddress.results.length === 0) {
      alert('invalid address entered - please resubmit a correctly formatted address');
    } else {
      geojson.features = [];
      var coordinates = geocodedAddress.results[0].geometry.location;
      map.setView(coordinates, 10);
      getEventfulEvents(coordinates.lat + ',' + coordinates.lng);
    }
  });
};

var getEventfulEvents = function (location) {
  $.ajax({
    url: '/getEvents',
    method: 'GET',
    data: {
      location: location,
    },
    success: function (data) {
      var eventsNearLocation  = JSON.parse(data).events.event;
      if (eventsNearLocation.length > 0) {
        displayEvents(eventsNearLocation);
      }
    },
    error: function (err) {
      console.log(err);
    },
  });
};

var displayEvents = function (eventsNearLocation) {
  var newFeature = {};
  for (var i = 0; i < eventsNearLocation.length; i++) {
    newFeature = formatEvent(eventsNearLocation[i]);
    geojson.features.push(newFeature);    
  }
  eventsLayer.setGeoJSON(geojson);
};

var formatEvent = function (event) {
  return {
    type: 'Feature',
    properties: {
      title: event.title,
      venue: event.venue_name,
      url: event.url,
      "image": event.image.medium.url,
      "marker-symbol": "star",
      "marker-color": "#52CCA3",
      "marker-size": "large"
    },
    geometry: {
      type: 'Point',
      coordinates: [event.longitude, event.latitude]
    }
  };
};
