import React, { Component } from 'react';
import { Segment, Icon, Grid, Image, Card } from 'semantic-ui-react';
import { googleApi } from "../config"
import { Map } from 'google-maps-react'
import GoogleMapContainer from '../containers/GoogleMapContainer';
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

                        <GoogleMapContainer
                            visible={this.state.mapVisible}
                            center={{ lat: this.state.lat, lng: this.state.lng, place: this.state.place }}
                            places={this.props.placesList}
                            currentPosition={this.props.currentPosition}
                            resetMap={this.resetMap}
                            loading={true}
                            closeMap={this.closeMap}
                            getPlaces={this.props.getPlaces}
                            query={this.props.query}
                            close={this.state.close}
                            setNewLoc={this.props.setNewLoc}
                        >

                        </GoogleMapContainer>
                    </div>
                    <Cards
                        placesList={this.props.placesList}
                        showMap={this.showMap}
                    ></Cards>

                </div >
            )
        else
            return (<div></div>)
    }
}
