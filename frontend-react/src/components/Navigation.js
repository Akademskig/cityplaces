import React, { Component } from 'react';
import "semantic-ui-css/semantic.min.css"
import { Menu, Dropdown, Icon } from "semantic-ui-react"
import { Container } from 'semantic-ui-react';
import { Link } from 'react-router-dom'
import { NavigationRoutes } from '../routes'


class Navigation extends Component {
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
            <Dropdown.Item >Saved Places</Dropdown.Item>
            <Dropdown.Item>My Places</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <Menu.Item
          position="right"
          as={Link} to="/login"
        >
          Logout
        </Menu.Item>
      </Menu>

    );
  }
}

export default Navigation;
