import { googleApi } from '../config'
import { GoogleApiWrapper } from 'google-maps-react';
import React, { Component } from 'react'
import { Map, InfoWindow, Marker, MapControl } from 'google-maps-react';
import { Segment, Button, Container, Card, CardHeader, Icon } from 'semantic-ui-react';
import { mapStyles } from '../config/map-styles'
// ...

export class GoogleMapContainer extends Component {
    pIds = []
    state = {
        places: this.props.places,
        placesIds: []
    }

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
    fetchPlaces = (mapProps, map) => {
        const newCenter = new this.props.google.maps.LatLng(map.center.lat(), map.center.lng())
        this.setState({
            center: newCenter
        })
        const service = new this.props.google.maps.places.PlacesService(map);
        const requestPlaces = {
            location: this.state.center,
            radius: this.props.query.radius,
            keyword: this.props.query.keyword
        }

        const callbackPlaces = (data) => {
            data.forEach(d => {
                if (!this.state.placesIds.includes(d.id))
                    this.createMarker(d, null, map)
                this.pIds.push(d.id)
                let requestDetails = {
                    placeId: d.place_id,
                    fields: ["opening_hours"]
                }
                service.getDetails(requestDetails, (det) => {
                    d["opening_hours"] = det ? det.opening_hours : det
                })
            })
            this.setState({
                places: data,
                placesIds: this.pIds
            })
        }
        service.nearbySearch(requestPlaces, callbackPlaces);
    }

    async createMarker(place, position, map) {
        var marker = new window.google.maps.Marker({
            map: map,
            position: position || place.geometry.location,
            icon: place ? {
                url: place.icon, scaledSize: place.id !== this.props.center.place.id ?
                    new this.props.google.maps.Size(25, 25) : new this.props.google.maps.Size(34, 34)
            } : null,
        });
        var infowindow = new window.google.maps.InfoWindow();
        window.google.maps.event.addListener(marker, 'click', function () {
            infowindow.setContent(place ? infoContent(place) : "Your location");
            infowindow.open(this.map, this);
        });
    }
    onMapMove = (mapProps, map) => {
        this.fetchPlaces()
    }
    prepareMap = (mapProps, map) => {
        this.setState({
            places: this.props.places
        })
        this.state.places.forEach(p => {
            this.createMarker(p, null, map)
        })
        this.createMarker(null, this.props.currentPosition, map)
        this.pIds = []
        map.controls[this.props.google.maps.ControlPosition.TOP_RIGHT].push(closeButton(this.props.closeMap));
    }

    render() {
        if (!this.props.visible) {
            return <div></div>
        }
        return (
            <div>

                < Map
                    google={this.props.google}
                    zoom={16}
                    visible={this.props.visible}
                    initialCenter={this.props.center}
                    center={this.state.center || this.props.center}
                    onDragend={this.fetchPlaces}
                    onClick={this.setCurrentLoc}
                    onReady={this.prepareMap}
                    styles={mapStyles}
                >

                </Map >
            </div >
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
            <img width="150px"src=${src}>
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
})(GoogleMapContainer)

