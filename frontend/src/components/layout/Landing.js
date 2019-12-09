import React, { Component } from "react";
import { Link } from "react-router-dom";

class Landing extends Component {
  componentDidMount() {
    if(localStorage.getItem('jwtToken') && localStorage.getItem('userType') === 'buyer'){
      this.props.history.push("/home");
    } else if(localStorage.getItem('jwtToken') && localStorage.getItem('userType') === 'owner'){
      this.props.history.push("/restaurantHome");
    }
      
  }
  render() {
    return (
      <div className="container bg-image valign-wrapper">
        <div className="row">
          <div className="col s12 center-align">
            <h4>
              <span style={{ fontFamily: "monospace" }}>Let's eat</span> 
            </h4>
            <p className="flow-text grey-text text-darken-1">
            Signup as
            </p>
            <br />
            <div className="col s6">
              <Link
                to="/register?user=owner"
                style={{
                  width: "140px",
                  borderRadius: "3px",
                  letterSpacing: "1.5px"
                }}
                className="btn btn-large waves-effect waves-light hoverable blue accent-3"
              >
                OWNER
              </Link>
            </div>
            <div className="col s6">
              <Link
                to="/register?user=buyer"
                style={{
                  width: "140px",
                  borderRadius: "3px",
                  letterSpacing: "1.5px"
                }}
                className="btn btn-large waves-effect waves-light hoverable blue accent-3"
              >
                BUYER
              </Link>
            </div>
            {/* <div className="col s6">
              <Link
                to="/login"
                style={{
                  width: "140px",
                  borderRadius: "3px",
                  letterSpacing: "1.5px"
                }}
                className="btn btn-large btn-flat waves-effect white black-text"
              >
                Log In
              </Link>
            </div> */}
          </div>
        </div>
      </div>
    );
  }
}

export default Landing;
