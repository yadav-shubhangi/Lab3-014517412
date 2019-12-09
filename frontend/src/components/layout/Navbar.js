import React, { Component } from "react";
import { Link } from "react-router-dom";
import {Redirect} from 'react-router';

class Navbar extends Component {
  constructor(){
    super()
    this.state = {
    }
  }
  handleLogout = e => {
    console.log('here', this, this.props)
    localStorage.removeItem('jwtToken')
    localStorage.removeItem('userType')
    localStorage.removeItem('buyerId')
    localStorage.removeItem('ownerId')
    localStorage.removeItem('restaurantId')
    sessionStorage.clear();
    this.setState({
      redirectVar: <Redirect to="/login"/>
    })
  };
  render() {
    let navLogin = null
    if(localStorage.getItem('jwtToken') && localStorage.getItem('userType') === 'buyer' ){
      console.log("Able to read token");
      navLogin = (
        <ul id="nav-mobile" className="right hide-on-med-and-down">
                  <li><Link to="/home" className="col s5 brand-logo center black-text"> GRUBHUB </Link></li>
                  <li><Link to="/profile"> Profile </Link></li>
                  <li><Link to="/past-orders"> Past Orders </Link></li>
                  <li><Link to="/upcoming-orders"> Upcoming Orders </Link></li>
                  <li><button
                        onClick={this.handleLogout}
                        className="btn btn-small waves-effect waves-light hoverable blue accent-3"
                      >
                        Logout
                      </button></li>
                </ul>
      );
  } else if(localStorage.getItem('jwtToken') && localStorage.getItem('userType') === 'owner' ){
    console.log("Able to read token");
    navLogin = (
      <ul id="nav-mobile" className="right hide-on-med-and-down">
                <li><Link to="/restaurant-home" className="col s5 brand-logo center black-text"> GRUBHUB </Link></li>
                <li><Link to="/restaurant-orders"> Orders </Link></li>
                <li><Link to="/restaurant-menu"> Menu </Link></li>
                <li><button
                      onClick={this.handleLogout}
                      className="btn btn-small waves-effect waves-light hoverable blue accent-3"
                    >
                      Logout
                    </button></li>
              </ul>
    );
} else{
      //Else display title only
      console.log("Not Able to read cookie");
      navLogin = (
        <ul id="nav-mobile" className="right hide-on-med-and-down">
        <li><Link to="/" className="col s5 brand-logo center black-text"> GRUBHUB </Link></li>
      </ul>
      )
  }
    return (
      <div className="navbar-fixed">
        <nav className="z-depth-0">
          <div className="nav-wrapper black">
              <nav>
                {this.state.redirectVar}
                {navLogin}
              </nav>
            </div>
        </nav>
      </div>
    );
  }
}

export default Navbar;
