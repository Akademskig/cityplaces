import React, { Component } from 'react';
import { Segment, Icon, Grid, Image, Card, Button, Pagination, Input, GridColumn, Label } from 'semantic-ui-react';
import { googleApi } from "../config"
import * as _ from 'lodash'
import PlacesApi from '../services/places';
import { notify } from '../services/notifications';
import { PropTypes } from 'prop-types';

export default class Cards extends Component {

    constructor(props) {
        super(props)

        this.placesApi = new PlacesApi()
        this.state = {
            items: 3,
            savedPlaces: [],
            placesList: this.props.placesList,
            pages: [],
            activePage: 1,
            itemsPerPage: 6
        }
    }

    placesListCount
    colors = ["yellow", "orange", "blue", "green", "red"]
    pages = []
    setCardNums = () => {
        if (window.innerWidth < 650)
            this.setState({
                items: 1
            })
        else if (window.innerWidth < 1200) {
            this.setState({
                items: 2
            })
        }
        else
            this.setState({ items: 3 })
    }

    savePlace = (pid, e) => {
        const savedPlaces = this.state.savedPlaces
        this.placesApi.savePlace({ user_id: localStorage.getItem("user_id"), place_id: pid })
            .then(() => notify("success", "Place saved."))
        savedPlaces.push(pid)
        this.setState({
            savedPlaces: savedPlaces
        })
        e.target.disabled = true

    }

    removePlace = (pid, e) => {
        this.placesApi.removePlace(localStorage.getItem("user_id"), pid)
            .then(() => notify("success", "Place removed."))
        this.props.updatePlaces(pid)
        if (this.state.activePage > Math.ceil(this.placesListCount / parseInt(this.state.itemsPerPage)))
            this.setState({ activePage: Math.ceil(this.placesListCount / parseInt(this.state.itemsPerPage)) })
    }

    paginate = (list, activePage, offset) => {
        offset = parseInt(offset)
        activePage = parseInt(activePage)
        const start = activePage * offset - offset
        const end = start + offset > list.length ? list.length : start + offset
        const newList = list.slice(start, end)
        return newList
    }

    componentWillMount = () => {
        this.setCardNums()
        window.addEventListener("resize", (ev) => {
            this.setCardNums()
        })
        this.placesApi.getPlacesForUser(localStorage.getItem("user_id"))
            .then(res => {
                res.data.data.forEach(d => {
                    this.state.savedPlaces.push(d.place_id)
                })
            })
        if (this.props.type === "save")
            this.setState({ placesList: this.state.savedPlaces })
    }
    handlePageChange = (p, e) => {
        this.setState({
            activePage: e.activePage
        })
    }
    handleItemsPerPageChange = (e) => {
        this.setState({
            itemsPerPage: e.target.value
        })
        if (this.state.activePage > Math.ceil(this.placesListCount / parseInt(e.target.value)))
            this.setState({ activePage: Math.ceil(this.placesListCount / parseInt(e.target.value)) })
    }


    componentWillUnmount() {
        window.removeEventListener("resize", (ev) => {
            this.setCardNums()
        })
    }

    render() {
        if (!this.props.placesList || this.props.placesList.length === 0)
            return (

                <div style={{ textAlign: "center" }}>No places found.</div>)
        else {
            this.pages = this.paginate(this.props.placesList, this.state.activePage, this.state.itemsPerPage)
            this.placesListCount = this.props.placesList.length
            this.totalPages = Math.ceil(this.placesListCount / this.state.itemsPerPage)
            return (
                <div>
                    <Grid stackable columns={2}>
                        <GridColumn>
                            <div style={{ marginBottom: "14px" }}>
                                <Pagination
                                    activePage={this.state.activePage}
                                    totalPages={this.totalPages}
                                    onPageChange={this.handlePageChange.bind(this)
                                    }
                                />
                            </div>

                            <Label color="teal" size="large">{`Total items: ${this.placesListCount}`}</Label>
                        </GridColumn>
                        <GridColumn textAlign="right">

                            <Input
                                name="rows"
                                type="number"
                                label={{ content: "Max Displayed Items", color: "teal" }}
                                value={this.state.itemsPerPage}
                                min="1"
                                max={this.placesListCount}
                                onChange={this.handleItemsPerPageChange}
                            >
                            </Input>

                        </GridColumn>
                    </Grid>

                    <CardList {...this.props}
                        pages={this.pages}
                        savedPlaces={this.state.savedPlaces}
                        savePlace={this.savePlace}
                        removePlace={this.removePlace}
                        items={this.state.items}
                    ></CardList>
                </div >
            )
        }
    }
}


const CurrentStatus = (props) => {
    if (props.hasOwnProperty("opened") && props.opened === "OPENED")
        return (<p style={{ color: "green" }}>OPENED</p>)
    else if (props.hasOwnProperty("opened") && props.opened === "CLOSED")
        return (<p style={{ color: "red" }}>CLOSED</p>)
    else return (<p>?</p>)
}

const SaveOrRemoveBut = (props) => {
    if (props.type !== "save") {
        return (<Button compact icon={{ name: "save" }} disabled={props.disabled} color={props.saveButtonColor} onClick={props.savePlace}></Button>)
    }
    else {
        return (<Button compact icon={{ name: "circle remove" }} color="red" onClick={props.removePlace}></Button>)
    }
}

const CardList = (props) => {
    const colors = ["yellow", "orange", "blue", "green", "red"]
    return (

        < Card.Group itemsPerRow={props.items} >
            {
                props.pages.map(p => {

                    const lat = p.geometry.location.lat
                    const lng = p.geometry.location.lng
                    const color = _.sample(colors)
                    const imageSize = 100
                    let openedNow = "?"
                    let src = ""
                    let saveButtonColor = "orange"
                    let disabled = false
                    if (props.savedPlaces.includes(p.place_id)) {
                        disabled = true
                    }
                    if (p.photos) {
                        const photoreference = p.photos[0].photo_reference
                        if (photoreference)
                            src = `${googleApi.photosUrl}maxwidth=200&photoreference=${photoreference}&key=${googleApi.apiKey}`
                        else
                            src = p.photos[0].getUrl()
                    }
                    if (p.opening_hours && p.opening_hours.open_now)
                        openedNow = "OPENED"
                    if (p.opening_hours && !p.opening_hours.open_now)
                        openedNow = "CLOSED"
                    return (
                        <Card color={color} key={p.id}>
                            <Card.Content>
                                <Card.Header >
                                    <Grid columns={2}>
                                        <Grid.Column width={12}>
                                            {p.name}

                                        </Grid.Column>
                                        <Grid.Column textAlign="right" width={4}>
                                            <Image size="mini" src={p.icon}></Image>
                                        </Grid.Column>
                                    </Grid>
                                </Card.Header>
                            </Card.Content>
                            <Card.Content>
                                <Grid columns={2} height="100%">
                                    <Grid.Column verticalAlign="middle">

                                        <Card.Meta >
                                            <Icon name="star"></Icon>
                                            {p.rating}
                                        </Card.Meta>

                                        <Segment vertical basic compact style={{ paddingBottom: 0 }}>
                                            <Card.Description>
                                                {p.vicinity}
                                                <CurrentStatus opened={openedNow}></CurrentStatus>
                                            </Card.Description>
                                        </Segment>
                                        <Segment basic vertical style={{ paddingBottom: 0 }}>
                                            <Icon onClick={props.showMap.bind(this, lat, lng, p)} className="map-icon" title="Map" name="map" color="blue"></Icon>
                                        </Segment>
                                    </Grid.Column>
                                    <Grid.Column>
                                        <span style={{ borderRadius: "5px", height: imageSize + "px", float: "right", overflow: "hidden" }} >
                                            <Image src={src} size="small" rounded></Image>
                                        </span>
                                    </Grid.Column>
                                </Grid>
                                <Segment basic vertical textAlign="right" style={{ marginBottom: 0 }}>
                                    <SaveOrRemoveBut placeId={p.place_id} removePlace={props.removePlace.bind(this, p.place_id)} savePlace={props.savePlace.bind(this, p.place_id)} type={props.type} saveButtonColor={saveButtonColor} disabled={disabled}></SaveOrRemoveBut>
                                </Segment>
                            </Card.Content>
                        </Card>)
                }
                )
            }
        </Card.Group >)
}

CardList.propTypes = {
    placesList: PropTypes.arrayOf(PropTypes.object).isRequired,
    items: PropTypes.number.isRequired,
    savedPlaces: PropTypes.arrayOf(PropTypes.string).isRequired,
    savePlace: PropTypes.func.isRequired,
    removePlace: PropTypes.func.isRequired
}