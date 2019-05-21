import React, { Component } from 'react';
import "semantic-ui-css/semantic.min.css"
import { Menu, Dropdown, Icon } from "semantic-ui-react"
import { Link } from 'react-router-dom'
import LoginService from '../services/login';


class Navigation extends Component {
  constructor(props) {
    super(props)

    this.loginService = new LoginService()
    this.state = {
      username: localStorage.getItem("user_name")
    }
  }
  render() {
    return (
      <Menu attached="top">
        <Dropdown text="Menu" item>
          <Dropdown.Menu>
            <Dropdown.Item as={Link} to="/locations/current">
              Current Location
              </Dropdown.Item>
            <Dropdown.Item as={Link} to="/locations/other">
              Other Locations
              </Dropdown.Item>
            <Dropdown.Item as={Link} to="/locations/saved">Saved Places</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <Menu.Item position="right">
          <Dropdown text={this.state.username ? <div><Icon name="user"></Icon>{` ${this.state.username}`}</div> : null}>
            <Dropdown.Menu className="rightDropdown">
              <Dropdown.Item
                as={Link} to="/login">
                Logout
          </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Menu.Item>
      </Menu >

    );
  }
}

export default Navigation;
