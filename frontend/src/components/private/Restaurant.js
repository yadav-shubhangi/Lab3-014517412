import React, { Component } from "react";
import axios from "axios";
import constants from '../../utils/constants'

class Restaurant extends Component {
  constructor() {
    super();
    this.state = {
      foodItems: [],
      sectionInput: false,
      section: '',
      restaurantId: '',
      cart: {}
    };
  }

  componentDidMount() {
    if (!localStorage.getItem('jwtToken') || !localStorage.getItem('userType') === 'buyer' || !localStorage.getItem('buyerId')) {
      this.props.history.push("/login");
    }
    console.log('restaurant Id', this.props.match.params.id)
    this.getFoodItems(this.props.match.params.id);
  }

  componentWillMount(){
      if(sessionStorage.getItem('cart')!= null){
          let cart = JSON.parse(sessionStorage.getItem('cart'));
          this.setState({cart: cart})
      }
  }

  componentWillReceiveProps(){
      this.setState({
          restaurantId: this.props.match.params.id
      })
      console.log('res-----------', this.state.restaurantId)
  }

  getFoodItems = (restaurantId) => {
    axios
    .get(`${constants.BASE_URL}/foodItems/${restaurantId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('jwtToken')}`
      }
       })
    .then(res => {
      console.log('res.data', res.data)
      this.setState({
        foodItems: []
      })
      this.setState({
        foodItems: this.state.foodItems.concat(res.data)
      })
      console.log('state.foodItems', this.state.foodItems)
    })
    .catch(err =>{
      console.log(err.message, err)
    });
  }
  handleAddItem = (item) => {
      console.log("in add item");
      let cart = {...this.state.cart};
      if(cart.hasOwnProperty(item.id)) {
        let count = cart[item.id]["quantity"];
        cart[item.id]["quantity"] = count + 1;
      }
      else {
          cart[item.id] = {};
          cart[item.id]["name"]= item.name;
          cart[item.id]["quantity"]= 1;
          cart[item.id]["price"] = item.price;
          cart[item.id]["restaurantId"] = this.props.match.params.id;
      }
      console.log(cart);
      console.log('cart>>> in add', JSON.stringify(cart))
      sessionStorage.setItem('cart', JSON.stringify(cart));
      this.setState({cart : cart})
  }
  handleDeleteItem = (item) => {
    let cart = this.state.cart;
    if(cart.hasOwnProperty(item.id)) {
      let count = cart[item.id]["quantity"];
      if(count !== 0){
      cart[item.id]["quantity"] = count - 1;
      }
    }
    console.log(cart);
    console.log('cart>>> in delete', JSON.stringify(cart))

    sessionStorage.setItem('cart', JSON.stringify(cart));
    this.setState({cart : cart})
}

checkoutOrder = () => {
    this.props.history.push('/cart')
}

  render() {
    let foodItemArr = this.state.foodItems.map(section => {
      return(
      <tr className="row">
        <td col s12>
        <div class="divider"></div>
        <div class="section">
          <h5>{section.name}</h5>
          <tr className="row">
            <td col s12 ><b>Item Name </b></td>
            <td col s12 ><b>Description </b></td>
            <td col s12 ><b>Price </b></td>
          </tr>
          <p>{ section.items.map((item) => {
              let quantity = 0;
              if(this.state.cart.hasOwnProperty(item.id)){
                  quantity = this.state.cart[item.id]["quantity"];
              };
                return (
                  <tr className="row">
                  <td col s12 >{item.name}</td>
                  <td col s12 >{item.description}</td>
                  <td col s12 >{item.price}</td>
                  <td col s12 ><button onClick={()=> this.handleDeleteItem(item)}>-</button></td>
                  <td col s12 >{quantity}</td>
                  <td col s12> <button onClick={()=> this.handleAddItem(item)}>+</button></td>
                  </tr>
                )
              }) }</p>
        </div>
        </td>  
      </tr>
      )
    })
    return (
      <div className="container">
        <div className="row">
          <div className="landing-copy col s12 center-align">
            <h4>
              <b>Menu</b>
            </h4>
            <button style={{
                    width: "150px",
                    borderRadius: "3px",
                    letterSpacing: "1.5px",
                    marginTop: "1rem",
                    float: "right"
                  }}
                  type="submit"
                  onClick={this.checkoutOrder}
                  className="btn btn-large waves-effect waves-light hoverable blue accent-3">
                  Checkout</button>
            {foodItemArr}
          </div>
        </div>

      </div>
    );
  }
}

export default Restaurant
