var map;

function Foursquare(name)
{
    this.name = name;
}

function addFoursquare(locationList, name, lat, long)
{
    var foursquareURL = 'https://api.foursquare.com/v2/venues/search?ll=' + lat + ',' + long + '&client_id=' + clientID + '&client_secret=' + clientSecret + '&v=20170801' + '&query=' + name;
    $.getJSON(foursquareURL).done(function (data) {
        var results = data.response.venues[0];
        var url = results.url;
        var street = results.location.formattedAddress[0];
        var city = results.location.formattedAddress[1];
        var phone = results.contact.phone;

        var foursquare = new Foursquare(name);
        foursquare.url = url;
        foursquare.street = street;
        foursquare.city = city;
        foursquare.phone = phone;
        if(!foursquare.phone)
        {
            console.log("HERE");
            foursquare.phone = 'n/a';
            console.log(foursquare.phone);
        }
        foursquare.lat = lat;
        foursquare.long = long;
        foursquare.marker = new google.maps.Marker({
            position: new google.maps.LatLng(lat, long),
            map: map,
            title: name
        });

        foursquare.marker.addListener('click', function () {
            var contentString = '<div class="info-window-content"><div class="title"><b>' + name + "</b></div>" +
                    '<div><a href="' + url + '">' + url + "</a></div>" +
                    '<div>' + street + "</div>" +
                    '<div>' + city + "</div>" +
                    '<div><div>' + foursquare.phone + "</div></div>";
            foursquare.infoWindow.setContent(contentString);
            foursquare.infoWindow.open(map, this);
            foursquare.marker.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function () {
                foursquare.marker.setAnimation(null);
            }, 2000);
        });
        foursquare.visible = ko.observable(true);
        foursquare.bounce = function (place) {
            google.maps.event.trigger(foursquare.marker, 'click');
        };

        var contentString = '<div class="info-window-content"><div class="title"><b>' + name + "</b></div>" +
                '<div class="content"><a href="' + url + '">' + url + "</a></div>" +
                '<div class="content">' + street + "</div>" +
                '<div class="content">' + city + "</div>" +
                '<div class="content">' + phone + "</div></div>";

        foursquare.infoWindow = new google.maps.InfoWindow({content: contentString});
        foursquare.showMarker = ko.computed(function () {
            if (foursquare.visible() === true) {
                foursquare.marker.setMap(map);
            } else {
                foursquare.marker.setMap(null);
            }
            return true;
        }, foursquare);

        locationList.push(foursquare);
    }).fail(function () {
        alert("Error loading the Foursquare API call. Please try again.");
    });
}
