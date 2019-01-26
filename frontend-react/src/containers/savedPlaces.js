import React, { Component } from 'react';
import { Segment, Input } from 'semantic-ui-react';
import PlacesList from '../components/PlacesList';
import PlacesApi from "../services/places"
import { notify } from '../services/notifications'
import { GoogleApiWrapper } from 'google-maps-react';
import { googleApi } from '../config';
export class SavedPlaces extends Component {

    state = {
        loadingPlaces: true,
        filteredPlaces: [],
        placesList: []
    }
    constructor() {
        super()
        this.gma = new PlacesApi()
    }
    getPosition = (reset) => {
        this.setState({ loading: true })
        this.gma.getCurrentPosition(reset).then(data => {
            this.setState({
                loading: false,
                position: data.location,
                lat: data.lat,
                lng: data.lng
            })
        }).catch(err => {
            notify("error", err.message)
            this.setState({ loading: false })
        })
    }
    handleSearch = (value) => {
        let filteredPlaces = this.state.placesList ? this.state.placesList.filter((pl) => pl.name.toLowerCase().match(value.toLowerCase())) : null
        this.setState({
            filteredPlaces: filteredPlaces
        })
    }
    updatePlaces = (pid) => {
        let filteredPlaces = this.state.filteredPlaces.filter(fp => fp.place_id !== pid)
        this.setState({
            filteredPlaces: filteredPlaces
        })
    }
    componentWillMount = () => {
        this.getPosition()
        this.gma.getPlacesForUser(localStorage.getItem("user_id"))
            .then(data => {
                let placesList = []
                if (data.data.data.length === 0) {
                    this.setState({
                        placesList: placesList,
                        filteredPlaces: placesList,
                        loadingPlaces: false,

                    })
                    return
                }
                data.data.data.forEach((d, i) => {
                    let requestDetails = {
                        placeId: d.place_id,
                        fields: []
                    }
                    this.gma.getDetails(requestDetails.placeId, requestDetails.fields).then((det) => {
                        placesList.push(det.data.data)
                        if (placesList.length === data.data.data.length) {
                            this.setState({
                                placesList: placesList,
                                filteredPlaces: placesList,
                                loadingPlaces: false
                            })
                        }
                    })
                })

            })

    }

    render() {
        return (
            <Segment.Group >


                <Segment>
                    <SearchBar onSearch={this.handleSearch} />
                </Segment>
                <Segment loading={this.state.loadingPlaces}>
                    <PlacesList
                        {...this.props}
                        updatePlaces={this.updatePlaces}
                        type={"save"}
                        setNewLoc={this.setNewLoc}
                        query={this.state.query}
                        placesList={this.state.filteredPlaces}
                        getPlaces={this.getPlacesFromMap}
                        currentPosition={{ lat: this.state.lat, lng: this.state.lng }}
                    ></PlacesList>
                </Segment>
            </Segment.Group >
        );
    }
}

const SearchBar = (props) => {

    const handleSearch = (e) => {
        props.onSearch(e.target.value)
    }

    return (
        <Input
            icon='search'
            iconPosition='left'
            placeholder='Search...'
            className='prompt'
            floated="right"
            onChange={handleSearch}
        />
    )
}


export default SavedPlaces