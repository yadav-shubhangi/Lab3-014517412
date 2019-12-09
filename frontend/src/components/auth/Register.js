import React, { Component } from "react";
import { Link } from "react-router-dom";
import classnames from "classnames";
import queryString from 'query-string';
import { createUserMutation } from '../../mutation/mutations'
import bcrypt from 'bcryptjs'

class Register extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      type: "",
      restaurantName: '',
      restaurantZipcode: '',
      cuisine: '',
      errors: {},
      isOwner: false,
      userExists: false,
      badRequest: false,
      serverError: false,
      passwordError: false
    };
  }

  componentDidMount() {
    if(localStorage.getItem('jwtToken') && localStorage.getItem('userType') === 'buyer'){
      this.props.history.push("/home");
    } else if(localStorage.getItem('jwtToken') && localStorage.getItem('userType') === 'owner'){
      this.props.history.push("/restaurant-home");
    }
    const values = queryString.parse(this.props.location.search)
        if (values.user === 'owner') {
          this.setState({
            isOwner: true
          })
        }
      
  }

  onChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();
    if(this.state.password && this.state.confirmPassword && this.state.password !== this.state.confirmPassword){
      this.setState({
        passwordError: true
      })
			setTimeout(() => this.setState({ passwordError: false }), 3000);
      return ''
    }

    const newUser = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password
    };
    if (this.state.isOwner) {
      newUser.type = 'owner'
      newUser.restaurantName = this.state.restaurantName
      newUser.restaurantZipcode = this.state.restaurantZipcode
      newUser.cuisine = this.state.cuisine
    } else {
      newUser.type = 'buyer'
    }

    let salt = bcrypt.genSaltSync(10),
      hash = bcrypt.hashSync(this.state.password, salt)
    newUser.password = hash

    this.props.createUserMutation({
      variables: newUser
    })
  };

  render() {
    const { errors } = this.state;

    return (
      <div className="container">
        <div className="row">
          <div className="col s8 offset-s2">
            <Link to="/" className="btn-flat waves-effect">
              <i className="material-icons left">keyboard_backspace</i> Back to
              home
            </Link>
            <div className="col s12" style={{ paddingLeft: "11.250px" }}>
              <h4>
                <b>Register</b> below
              </h4>
              <p className="grey-text text-darken-1">
                Already have an account? <Link to="/login">Log in</Link>
              </p>
            </div>
            <form onSubmit={this.onSubmit}>
              <div className="input-field col s12">
                <input
                  required
                  onChange={this.onChange}
                  value={this.state.name}
                  error={errors.name}
                  id="name"
                  type="text"
                  className={classnames("", {
                    invalid: errors.name
                  })}
                />
                <label htmlFor="name">Name</label>
                <span className="red-text">{errors.name}</span>
              </div>
              <div className="input-field col s12">
                <input
                  required
                  onChange={this.onChange}
                  value={this.state.email}
                  error={errors.email}
                  id="email"
                  type="email"
                  className={classnames("", {
                    invalid: errors.email
                  })}
                />
                <label htmlFor="email">Email</label>
                <span className="red-text">{errors.email}</span>
              </div>
              <div className="input-field col s12">
                <input
                  required
                  onChange={this.onChange}
                  value={this.state.password}
                  error={errors.password}
                  id="password"
                  type="password"
                  pattern="(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$"
                                title="Atleast 1 lowercase, 1 uppercase, 1 number, 1 special charater and minimum length of 8 is allowed"
                  className={classnames("", {
                    invalid: errors.password
                  })}
                />
                <label htmlFor="password">Password</label>
                <span className="red-text">{errors.password}</span>
              </div>
              <div className="input-field col s12">
                <input
                  required
                  onChange={this.onChange}
                  value={this.state.confirmPassword}
                  error={errors.confirmPassword}
                  id="confirmPassword"
                  type="password"
                  pattern="(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$"
                                title="Atleast 1 lowercase, 1 uppercase, 1 number, 1 special charater and minimum length of 8 is allowed"
                  className={classnames("", {
                    invalid: errors.confirmPassword
                  })}
                />
                <label htmlFor="confirmPassword">Confirm Password</label>
                <span className="red-text">{errors.confirmPassword}</span>
              </div>
              {this.state.isOwner && <div>
                <div className="input-field col s12">
                <input
                  required
                  onChange={this.onChange}
                  value={this.state.restaurantName}
                  error={errors.restaurantName}
                  id="restaurantName"
                  type="text"
                  className={classnames("", {
                    invalid: errors.restaurantName
                  })}
                />
                <label htmlFor="restaurantName">Restaurant Name</label>
                <span className="red-text">{errors.restaurantName}</span>
              </div>
              <div className="input-field col s12">
                <input
                  required
                  onChange={this.onChange}
                  value={this.state.restaurantZipcode}
                  error={errors.restaurantZipcode}
                  id="restaurantZipcode"
                  type="text"
                  className={classnames("", {
                    invalid: errors.restaurantZipcode
                  })}
                />
                <label htmlFor="restaurantZipcode">Restaurant Zipcode</label>
                <span className="red-text">{errors.restaurantZipcode}</span>
              </div>
              <div className="input-field col s12">
                <input
                  required
                  onChange={this.onChange}
                  value={this.state.cuisine}
                  error={errors.cuisine}
                  id="cuisine"
                  type="text"
                  className={classnames("", {
                    invalid: errors.cuisine
                  })}
                />
                <label htmlFor="cuisine">Cusine</label>
                <span className="red-text">{errors.cuisine}</span>
              </div>
              </div>}
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
                  Sign up
                </button>
                {this.state.userExists && <p className="red-text text-darken-1">
                This email id already exists.
              </p>}
              {this.state.serverError && <p className="red-text text-darken-1">
                Server error!  Please try refreshing the page and try again.
              </p>}
              {this.state.badRequest && <p className="red-text text-darken-1">
                Bad request.
              </p>}
              {this.state.passwordError && <p className="red-text text-darken-1">
               Password and confirm password should match.
              </p>}
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default compose(
  graphql(createUserMutation, { name: "createUserMutation" })
)(Register)
