import React, { Component } from "react";
import { Link } from "react-router-dom";
import classnames from "classnames";
import constants from '../../utils/constants'
import queryString from 'query-string';
import setAuthToken from "../../utils/setAuthToken";
import { graphql, compose, Query } from 'react-apollo'
import { getUsersQuery, loginUserQuery } from '../../queries/queries'
import { createUserMutation } from '../../mutation/mutations'

class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      errors: {},
      redirected: false,
      wrongCredentials: false,
      badRequest: false,
      serverError: false
    };
  }

  componentDidMount() {
    if(localStorage.getItem('jwtToken') && localStorage.getItem('userType') === 'buyer'){
      this.props.history.push("/home");
    } else if(localStorage.getItem('jwtToken') && localStorage.getItem('userType') === 'owner' && localStorage.getItem('restaurantId')){
      this.props.history.push("/restaurant-home");
    }
    const values = queryString.parse(this.props.location.search)
        if (values.isRedirected === 'true') {
          this.setState({
            redirected: true
          })
        }
  }
  onChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();

    const userData = {
      email: this.state.email,
      password: this.state.password
    };

    var index,
      isFound = false,
      allUserData = this.props.loginUserQuery
    for (index in allUserData.allUsers) {
      if (allUserData.allUsers[index].email == this.state.username && bcrypt.compareSync(this.state.password, allUserData.allUsers[index].password)) {
        localStorage.setItem("userId", allUserData.allUsers[index].id)
        localStorage.setItem("userName", allUserData.allUsers[index].firstname)
        localStorage.setItem("userType", allUserData.allUsers[index].userType)
        isFound = true
      }
    }
    if (isFound) {
      if (localStorage.getItem("userType") === 'buyer') {
        this.props.history.push("/home");
      } else if (localStorage.getItem("userType") === 'owner') {
        this.props.history.push("/restaurant-home");
      }
    } else {
      this.setState({ wrongCredentials: false })
    }
  };

  render() {
    const { errors } = this.state;

    return (
      <div className="container">
        <div style={{ marginTop: "4rem" }} className="row">
          <div className="col s8 offset-s2">
            <Link to="/" className="btn-flat waves-effect">
              <i className="material-icons left">keyboard_backspace</i> Back to
              home
            </Link>
            <div className="col s12" style={{ paddingLeft: "11.250px" }}>
              <h4>
                <b>Login</b> below
              </h4>
              {!this.state.redirected &&!this.state.badRequest &&!this.state.wrongCredentials &&!this.state.serverError &&<p className="grey-text text-darken-1">
                Don't have an account? <Link to="/register?user=buyer">Register</Link>
              </p>}
              {this.state.redirected &&!this.state.badRequest &&!this.state.wrongCredentials &&!this.state.serverError && <p className="grey-text text-darken-1">
                Your account has been created successfully.
              </p>}
              {this.state.badRequest &&<p className="red-text text-darken-1">
                Bad request.
              </p>}
              {this.state.wrongCredentials &&<p className="red-text text-darken-1">
                Incorrect credentials!
              </p>}
              {this.state.serverError &&<p className="red-text text-darken-1">
                Server Error! Please try refreshing the page and try again.
              </p>}
            </div>
            <form onSubmit={this.onSubmit}>
              <div className="input-field col s12">
                <input
                  required
                  onChange={this.onChange}
                  value={this.state.email}
                  error={errors.email}
                  id="email"
                  type="email"
                  className={classnames("", {
                    invalid: errors.email || errors.emailnotfound
                  })}
                />
                <label htmlFor="email">Email</label>
                <span className="red-text">
                  {errors.email}
                  {errors.emailnotfound}
                </span>
              </div>
              <div className="input-field col s12">
                <input
                  required
                  onChange={this.onChange}
                  value={this.state.password}
                  error={errors.password}
                  id="password"
                  type="password"
                  className={classnames("", {
                    invalid: errors.password || errors.passwordincorrect
                  })}
                />
                <label htmlFor="password">Password</label>
                <span className="red-text">
                  {errors.password}
                  {errors.passwordincorrect}
                </span>
              </div>
              <div className="col s12" style={{ paddingLeft: "11.250px" }}>
                <button
                  style={{
                    width: "150px",
                    borderRadius: "3px",
                    letterSpacing: "1.5px",
                    marginTop: "1rem"
                  }}
                  type="submit"
                  className="btn btn-large waves-effect waves-light hoverable blue accent-3"
                >
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default compose(
  graphql(loginUserQuery, { name: "loginUserQuery" }),
)(Login)