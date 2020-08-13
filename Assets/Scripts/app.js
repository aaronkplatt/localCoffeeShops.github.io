// beginning of Johnny's part
// displays current date
$(document).ready(function () {
    $("#current-date").append("<p><strong>Today's Date:</strong></p>" + (moment().format('dddd, MMMM Do')));

    // gets user's location
    navigator.geolocation.getCurrentPosition(function (position) {
        console.log(position);
        geoLat = position.coords.latitude;
        geoLon = position.coords.longitude;
        console.log(geoLat, geoLon);

        // loads user's location in google map
        initMap();

        // grabs weather for user's location
        queryURL = "https://api.openweathermap.org/data/2.5/weather?lat=" + geoLat + "&lon=" + geoLon + "&appid=8f775258afdec054195f89c38855f678&units=imperial";
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            console.log(response);
            const geoCity = response.name;
            console.log(geoCity);
            const country = response.sys.country;
            console.log(country);
            var currentIcon = $("<img>").attr("src", "http://openweathermap.org/img/wn/" + response.weather[0].icon + ".png");
            console.log(currentIcon);
            var rTemp0 = Math.floor(response.main.temp);
            console.log(rTemp0);

            $("#temp").empty();
            $("#current-icon").empty();
            $("#current-city").empty();

            $("#current-icon").prepend(currentIcon);
            $("#temp").append("<p><strong>Current Temp:</strong></p> " + rTemp0 + "° F");
            $("#current-city").append("<p><strong>Current City:</strong></p>" + geoCity + ", " + country);
        });
    })

});

// grabbing user's inputted location
var searchBtn = $("#searchBtn")

searchBtn.on("click", function (event) {
    event.preventDefault();
    var button = $(this);
    console.log("click");

    var city = $("#city-name").val().trim();
    console.log(city);

    // reverse lookup using open weather lol
    queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=8f775258afdec054195f89c38855f678&units=imperial";
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);
        const geoCity = response.name;
        console.log(geoCity);
        const country = response.sys.country;
        console.log(country);
        var currentIcon = $("<img>").attr("src", "http://openweathermap.org/img/wn/" + response.weather[0].icon + ".png");
        console.log(currentIcon);
        var rTemp0 = Math.floor(response.main.temp);
        console.log(rTemp0);

        geoLat = response.coord.lat
        console.log(geoLat);
        geoLon = response.coord.lon
        console.log(geoLon);

        initMap()

        $("#temp").empty();
        $("#current-icon").empty();
        $("#current-city").empty();

        $("#current-city").prepend(currentIcon);
        $("#temp").prepend("<p>Temperature: " + rTemp0 + "° F </p>");
        $("#current-city").append("<p>" + geoCity + ", " + country + "</p>");
    });
});

// google maps

// function initMap() {
//     // The location of user
//     var userLoc = {
//         lat: geoLat,
//         lng: geoLon
//     };
//     // The map, centered at location
//     var map = new google.maps.Map(
//         document.getElementById('map'), {
//             zoom: 12,
//             center: userLoc
//         });
//     // The marker, positioned at location
//     var marker = new google.maps.Marker({
//         position: userLoc,
//         map: map
//     })
// };

var map;
var service;
var infowindow;

function initMap() {
    var sydney = new google.maps.LatLng(geoLat, geoLon);

    infowindow = new google.maps.InfoWindow();

    map = new google.maps.Map(
        document.getElementById('map'), {
            center: sydney,
            zoom: 11
        });

    var request = {
        query: 'coffee shop',
        fields: ['name', 'geometry'],
    };

    var service = new google.maps.places.PlacesService(map);

    service.findPlaceFromQuery(request, function (results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < results.length; i++) {
                createMarker(results[i]);
            }
            map.setCenter(sydney);

            function createMarker(place) {
                console.log(place);

                new google.maps.Marker({
                    position: place.geometry.location,
                    map: map
                });

                new google.maps.Marker({
                    position: sydney,
                    map: map
                });
            }
            function createMarkers(places) {
                var bounds = new google.maps.LatLngBounds();
                var placesList = document.getElementById('places');
                console.log(places);
              
                for (var i = 0, place; place = places[i]; i++) {
                  var image = {
                    url: place.icon,
                    size: new google.maps.Size(71, 71),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(17, 34),
                    scaledSize: new google.maps.Size(25, 25)
                  };
              
                  var marker = new google.maps.Marker({
                    map: map,
                    icon: image,
                    title: place.name,
                    position: place.geometry.location
                  });
              
                  // var li = document.createElement('li');
                  // li.textContent = place.name;
                  // placesList.appendChild(li);
              
                //   bounds.extend(place.geometry.location);
                }
                // map.fitBounds(bounds);
              }

        }
    });
}

// end of Johnny's part