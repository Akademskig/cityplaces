
export default class MapsApi {

    constructor() {
        window.openMap = this.openMap
    }

    initMap(lat, lng, place) {
        this.lat = lat
        this.long = lng
        this.place = place

        this.loc = { lat: this.lat, lng: this.long };

        this.map = new window.google.maps.Map(document.getElementById('maps'), {
            center: this.loc,
            zoom: 15
        });

        if (!this.place) {
            this.marker = new window.google.maps.Marker({
                map: this.map,
                position: this.loc
            });

            var infowindow = new window.google.maps.InfoWindow();
            window.google.maps.event.addListener(this.marker, 'click', function () {
                infowindow.setContent(this.place);
                infowindow.open(this.map, this);
            });
        }
        else {
            this.place.forEach(function (place) {
                this.createMarker(place);
            })
        }
    }
    async createMarker(place) {
        var marker = new window.google.maps.Marker({
            map: this.map,
            position: place.geometry.location
        });
        var infowindow = new window.google.maps.InfoWindow();
        window.google.maps.event.addListener(marker, 'click', function () {
            infowindow.setContent(place.name);
            infowindow.open(this.map, this);
        });
    }
}


