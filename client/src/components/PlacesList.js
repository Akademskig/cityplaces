import React, { Component } from 'react';
import GoogleMapComponent from './GoogleMapComponent';
import Cards from './Cards';

export default class PlacesList extends Component {

    colors = ["blue", "purple", "orange", "red", "yellow"]
    items = 3
    state = {
        items: 3,
        lat: this.props.currentPosition.lat,
        lng: this.props.currentPosition.lng,
        mapVisible: false,
        close: false
    }
    showMap = (lat, lng, place) => {
        if (typeof lat == "function") {
            lat = lat()
            lng = lng()
        }
        if (this.state.mapVisible) {
            this.setState({
                mapVisible: false
            })
        } else {
            this.setState({
                lat: lat,
                lng: lng,
                mapVisible: true,
                place: place,
                close: false
            })
        }
    }

    closeMap = (e, map) => {
        this.setState({
            mapVisible: false,
            close: true
        })
    }

    setNewLoc = (loc) => {
        this.props.setNewLoc({ lat: loc.lat, lng: loc.lng })
    }

    render() {
        if (this.props.currentPosition.lat)
            return (
                <div>
                    <div hidden={!this.state.mapVisible} className="map-container ">

                        <GoogleMapComponent
                            {...this.props}
                            type={this.props.type}
                            visible={this.state.mapVisible}
                            center={{ lat: this.state.lat, lng: this.state.lng, place: this.state.place }}
                            places={this.props.placesList}
                            currentPosition={this.props.currentPosition}
                            resetMap={this.resetMap}
                            loading={true}
                            closeMap={this.closeMap}
                            getPlaces={this.props.getPlaces}
                            close={this.state.close}
                            setNewLoc={this.props.setNewLoc}
                        >

                        </GoogleMapComponent>
                    </div>
                    <Cards
                        type={this.props.type}
                        placesList={this.props.placesList}
                        userPlaces={this.state.userPlaces}
                        showMap={this.showMap}
                        updatePlaces={this.props.updatePlaces}
                    ></Cards>

                </div >
            )
        else
            return (<div></div>)
    }
}

