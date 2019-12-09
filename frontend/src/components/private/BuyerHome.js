import React, { Component } from "react";

class BuyerHome extends Component {
  constructor() {
    super();
    this.state = {
      search: ''
    };
  }

  componentDidMount() {
    if (!localStorage.getItem('jwtToken') || !localStorage.getItem('userType') === 'buyer' || !localStorage.getItem('buyerId')) {
      this.props.history.push("/login");
    }
  }

  onChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };

  searchFoodItems = e => {
    e.preventDefault();
    console.log('search state', this.state.search)
    this.props.history.push(`/search-results?search=${this.state.search}`)
  }

  render() {

    return (
      <div className="container">
        <div className="row">
          <div className="landing-copy col s12 center-align">
            <h6>
              <b>Hi, search any food item in the search box</b>
            </h6>
              <form action="post">
                <input 
                  type="text" 
                  placeholder="Search any food item" 
                  id="search" 
                  value={this.state.search} 
                  required
                  onChange={this.onChange}/>
                   <button type="submit" onClick={this.searchFoodItems}>
                  <i className="material-icons">search</i>
                </button>
              </form>
          </div>
        </div>
      </div>
    );
  }
}

export default BuyerHome
