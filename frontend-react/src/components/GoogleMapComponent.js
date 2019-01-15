import { googleApi } from '../config'
import { GoogleApiWrapper } from 'google-maps-react';
import React, { Component } from 'react'
import { Map } from 'google-maps-react';
import { mapStyles } from '../config/map-styles'

export class GoogleMapComponent extends Component {
    pIds = []
    state = {
        places: this.props.places,
        placesIds: [],
    }
    map
    input = document.getElementById("searchCityField")
    currentInfoShow = (props, marker, e) => {
        if (this.state.currentInfoVisible && marker === this.state.currentMarker)
            this.setState({ currentInfoVisible: false })
        else {
            this.setState({
                currentInfoVisible: true,
                currentMarker: marker,
                name: props.name
            })
        }
    }
    fetchPlaces = (mapProps, map, markerCenter) => {
        let newCenter = new this.props.google.maps.LatLng(map.center.lat(), map.center.lng())

        if (markerCenter)
            newCenter = new this.props.google.maps.LatLng(markerCenter.lat, markerCenter.lng)

        this.setState({
            center: newCenter
        })
        const service = new this.props.google.maps.places.PlacesService(map);
        let requestPlaces
        if (this.props.query && this.props.query.radius) {
            requestPlaces = {
                location: this.state.center,
                radius: this.props.query.radius,
                keyword: this.props.query.keyword
            }
        }
        else {
            requestPlaces = {
                location: this.state.center,
                rankBy: this.props.google.maps.places.RankBy.DISTANCE,
                keyword: this.props.query.keyword
            }
        }

        const callbackPlaces = (data) => {
            data.forEach(d => {
                if (!this.state.placesIds.includes(d.id))
                    this.createMarker(d, null, map)
                this.pIds.push(d.id)
                let requestDetails = {
                    placeId: d.place_id,
                    fields: ["opening_hours,url"]
                }
                service.getDetails(requestDetails, (det) => {
                    d["opening_hours"] = det ? det.opening_hours : det
                    d["url"] = det ? det.url : det
                })
            })
            this.setState({
                places: data,
                placesIds: this.pIds
            })

            this.props.getPlaces(this.state.places)
        }
        service.nearbySearch(requestPlaces, callbackPlaces);
    }

    async createMarker(place, position, map) {
        let location
        if (place) {
            location = { lat: place.geometry.location.lat, lng: place.geometry.location.lng }
            if (typeof place.geometry.location.lat == "function")
                location = { lat: place.geometry.location.lat(), lng: place.geometry.location.lng() }
        }
        let draggable = false
        if (position && !this.props.type)
            draggable = true
        var marker = new window.google.maps.Marker({
            map: map,
            position: position || location,
            draggable: draggable,
            icon: place ? {
                url: place.icon, scaledSize: place.id !== this.props.center.place.id ?
                    new this.props.google.maps.Size(25, 25) : new this.props.google.maps.Size(35, 35)
            } : null,
        });
        var infowindow = new window.google.maps.InfoWindow();
        window.google.maps.event.addListener(marker, 'click', function () {
            infowindow.setContent(place ? infoContent(place) : currentLocContent("You are here"));
            infowindow.open(map, this);
        });
        window.google.maps.event.addListener(marker, 'dragend', (e) => {
            this.fetchPlaces(null, map, { lat: e.latLng.lat(), lng: e.latLng.lng() })
        });
    }

    prepareMap = (mapProps, map) => {
        this.map = map
        this.setState({
            places: this.props.places
        })
        map.controls[this.props.google.maps.ControlPosition.TOP_RIGHT].push(closeButton(this.props.closeMap));
        this.prepareAutocomplete(map)
        this.createMarker(null, this.props.currentPosition, map)
    }

    prepareMarkers = (map) => {
        if (this.state.places)
            this.state.places.forEach(p => {
                this.createMarker(p, null, map)
            })
        else
            this.props.places.forEach(p => {
                this.createMarker(p, null, map)
            })

        this.pIds = []
    }
    prepareAutocomplete = (map) => {

        var input = document.getElementById('searchCityField');
        if (!input)
            return
        var autocomplete

        autocomplete = new this.props.google.maps.places.Autocomplete(input, { types: ['(cities)'] })
        autocomplete.bindTo('bounds', map);
        var infowindow = new this.props.google.maps.InfoWindow();
        var infowindowContent = document.getElementById('infowindow-content');
        infowindow.setContent(infowindowContent);
        this.props.google.maps.event.addListener(autocomplete, 'place_changed', () => {
            infowindow.close();
            var place = autocomplete.getPlace();
            if (!place.geometry) {
                return;
            }
            this.setState({ autoPlace: { lat: place.geometry.location.lat(), lng: place.geometry.location.lng() } })
            this.props.setNewLoc(this.state.autoPlace, place.formatted_address)

        })
    }

    componentDidUpdate = () => {
        if (this.props.visible) {
            this.prepareMarkers(this.map)
        }
    }

    render() {
        if (this.props.close) {
            return <div></div>
        }
        return (
            <div>
                <div>

                    < Map
                        google={this.props.google}
                        zoom={16}
                        visible={this.props.visible}
                        initialCenter={this.props.center}
                        center={this.state.center || this.props.center}
                        onReady={this.prepareMap}
                        styles={mapStyles}
                    >
                    </Map >

                </div >
            </div>
        );
    }
}
const closeButton = (closeMap) => {
    let controlBtn = document.createElement("div")
    let content = document.createElement("i")
    content.classList = "window close outline icon"
    content.style.color = "black"
    controlBtn.classList = "ui button big icon"
    controlBtn.style.margin = "10px"
    controlBtn.style.padding = "10px"
    controlBtn.style.backgroundColor = "white"
    controlBtn.style.borderRadius = "0"
    controlBtn.appendChild(content)
    controlBtn.addEventListener("click", closeMap)
    return (
        controlBtn
    )
}
const currentLocContent = (text) => {
    return `<div class="ui card" style="width:100px">
                    <div class="ui card content" style="padding:3px">
                        <div class="ui header">${text}</div>
                    </div>
                </div>`
}
const infoContent = (place) => {
    let src
    if (place.photos) {
        const photoreference = place.photos[0].photo_reference
        if (photoreference)
            src = `${googleApi.photosUrl}maxwidth=150&photoreference=${photoreference}&key=${googleApi.apiKey}`
        else
            src = place.photos[0].getUrl()
    }
    let openingHours = [`<div style="margin-bottom: 5px">OPENING HOURS</div>`]
    if (place.opening_hours && place.opening_hours.weekday_text) {
        place.opening_hours.weekday_text.forEach(wdt => {
            openingHours.push(`<div style="padding-bottom:2px">${wdt}</div>`)
        })
        openingHours = openingHours.join("")
    }
    else {
        openingHours = `<div>No additional data</div>`
    }
    return `<div class="ui card">
                    <div class="ui card content">
                        <div class="ui header">${place.name}</div>
                    </div>
                    <div class="ui card content">
                        <strong class="segment vertical basic">${place.vicinity}</strong>
                        <div class="info-image ui segment vertical basic">
                            <img width="150px" src=${src}>
            </div>
                            <div class="ui segment basic vertical">
                                ${openingHours}
                            </div>
                            <div class="ui segment basic vertical">
                                <a target="_blank" href=${place.url}><div>View on Google maps <div><a>
                </div>
                                </div>
                                </div>`
}

export default GoogleApiWrapper({
    apiKey: (googleApi.apiKey)
})(GoogleMapComponent)

