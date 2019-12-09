import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import axios from "axios"

import Navbar from "./layout/Navbar";
import Landing from "./layout/Landing";
import Register from "./auth/Register";
import Login from "./auth/Login";
import BuyerHome from "./private/BuyerHome";
import RestaurantHome from "./private/RestaurantHome";
import RestaurantOrders from "./private/RestaurantOrders";
import RestaurantMenu from "./private/RestaurantMenu"
import FoodItem from "./private/FoodItem"
import Profile from "./private/Profile"
import UpcomingOrders from "./private/UpcomingOrders"
import PastOrders from "./private/PastOrders"
import SearchResults from "./private/SearchResults";
import Restaurant from "./private/Restaurant";
import Cart from "./private/Cart";

class Main extends Component {
  constructor(props){
  super(props);
  this.state = {};  
}
componentWillMount(){
  console.log(localStorage.getItem('jwtToken') != null, localStorage.getItem('jwtToken'))
    if(localStorage.getItem('jwtToken') != null && localStorage.getItem('jwtToken')){
        console.log('here')
        this.setState({loggedIn: true});
        axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('jwtToken')}`
    } else {
      // this.props.history.push("/login");
    }
}
  render() {
    return (
        <Router>
          <div className="App">
            <Navbar loggedIn={this.state.loggedIn}/>
            
            <Route exact path="/" component={Landing} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/home" component={BuyerHome} />
            <Route loggedIn={this.state.loggedIn} exact path="/restaurant-home" component={RestaurantHome} />
            <Route exact path="/restaurant-menu" component={RestaurantMenu} />
            <Route exact path="/food-item" component={FoodItem} />
            <Route exact path="/profile" component={Profile} />
            <Route exact path="/search-results" component={SearchResults} />
            <Route exact path="/restaurant/:id" component={Restaurant} />
          </div>
        </Router>
    );
  }
}
export default Main;
