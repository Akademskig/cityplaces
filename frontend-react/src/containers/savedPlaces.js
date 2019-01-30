import React, { Component } from 'react';
import { Segment, Input, Select, Header, Icon } from 'semantic-ui-react';
import PlacesList from '../components/PlacesList';
import PlacesApi from "../services/places"
import { notify } from '../services/notifications'
import _ from "lodash"

export class SavedPlaces extends Component {

    state = {
        loadingPlaces: true,
        filteredPlaces: [],
        placesList: [],
        citiesList: []
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
        let filteredPlaces = this.state.filteredCities ? this.state.filteredCities.filter((pl) => pl.name.toLowerCase().match(value.toLowerCase())) : null
        this.setState({
            filteredPlaces: filteredPlaces
        })
    }

    filterCities = ($e, $e2) => {
        if ($e2.value === "all") {
            this.setState({
                filteredPlaces: this.state.placesList,
                filteredCities: this.state.placesList,
            })
            return
        }
        let filteredCities = this.state.placesList ? this.state.placesList.filter((pl) => pl.city.match($e2.value)) : null
        this.setState({
            filteredPlaces: filteredCities,
            filteredCities: filteredCities
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
                let citiesList = [{ "key": "all", "text": "All", "flag": "eu", "value": "all" }]
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

                        const city = det.data.data.address_components.find(ac => ac.types.includes("locality")).long_name
                        const country = det.data.data.address_components.find(ac => ac.types.includes("country")).long_name.toLowerCase()
                        citiesList.push({ "key": i, "text": city, "flag": country, "value": city })
                        placesList.push(Object.assign(det.data.data, { city: city }))
                        if (placesList.length === data.data.data.length) {
                            this.setState({
                                placesList: placesList,
                                filteredPlaces: placesList,
                                filteredCities: placesList,
                                loadingPlaces: false,
                                citiesList: _.uniqBy(citiesList, "text")
                            })
                        }
                    })
                })

            })

    }

    render() {
        return (
            <Segment.Group >
                <Segment textAlign="center" >
                    <Header size="medium" icon>
                        <Icon name="save" size="small"></Icon>
                        Saved Places
                </Header>
                </Segment>
                {this.state.citiesList.length > 0 ? <Segment >
                    <SearchBar filterCities={this.filterCities} citiesList={this.state.citiesList} onSearch={this.handleSearch} />
                </Segment> : null}
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
        <Segment basic vertical textAlign="right">
            <Select onChange={props.filterCities} style={{ marginRight: "14px" }} placeholder="Select City" options={props.citiesList}></Select>
            <Input
                icon='search'
                iconPosition='left'
                placeholder='Search...'
                className='prompt'
                floated="right"
                onChange={handleSearch}
            />
        </Segment>
    )
}


export default SavedPlaces