import React, { Component } from 'react';
import "semantic-ui-css/semantic.min.css"
import { Menu, Dropdown } from "semantic-ui-react"
import { Link } from 'react-router-dom'


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
            <Dropdown.Item as={Link} to="/locations/saved">Saved Places</Dropdown.Item>
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
