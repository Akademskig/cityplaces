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
            <Dropdown.Item as={Link} to="/login">
              Logout
              </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <Menu.Menu position="right">
          <div className='ui right aligned category search item'>
            <div className='ui transparent icon input'>
              <input className='prompt' type='text' placeholder='Search..' />
              <i className='search link icon' />
            </div>
            <div className='results' />
          </div>
        </Menu.Menu>
      </Menu>

    );
  }
}

export default Navigation;
