import React, { Component } from "react";
import axios from "axios";
import constants from '../../utils/constants'
import queryString from 'query-string';
import { graphql, compose } from 'react-apollo'
import { getFoodItemQuery, getSectionQuery } from '../../queries/queries'
import { addSectionMutation } from '../../mutation/mutations'

class RestaurantMenu extends Component {
  constructor() {
    super();
    this.state = {
      foodItems: [],
      sectionInput: false,
      section: '',
      sectionExists: false,
      badRequest: false,
      serverError: false,
      updateActionType: false,
      deleteActionType: false,
      addActionType: false,
      sectionNotFound: false,
      sectionDeletedText: false,
      sectionUpdatedText: false
    };
  }

  componentDidMount() {
    var allUsersData = this.props.getFoodItemQuery.allUsers
        var AllSections = []
        let index
        for (index in allUsersData) {
            if (allUsersData[index].id === localStorage.getItem("userId")) {
                AllSections = allUsersData[index].restaurantInfo.sections
            }
        }

    if (!localStorage.getItem('jwtToken') || !localStorage.getItem('userType') === 'owner' || !localStorage.getItem('ownerId')) {
      this.props.history.push("/login");
    }
    const values = queryString.parse(this.props.location.search)
    console.log('values', values)
    if(values){
      if(values.actionType === 'update'){
        this.setState({
          updateActionType: true
        })
        setTimeout(() => this.setState({ updateActionType: '' }), 3000);
      } else if (values.actionType === 'delete') {
        this.setState({
          deleteActionType: true
        })
        setTimeout(() => this.setState({ deleteActionType: '' }), 3000);
      } else if (values.actionType === 'add') {
        this.setState({
          addActionType: true
        })
        setTimeout(() => this.setState({ addActionType: '' }), 3000);
      }
    }
  }

  
  addSectionInput = e => {
    this.setState({
      sectionInput: true
    })
  }

  addSection = e => {
    e.preventDefault();    
    console.log('adding section')
    let sectionData = {
      sectionName: this.state.section
    }
    
  }

  onChange = e => {
    this.setState({ 
      [e.target.id]: e.target.value,
      sectionExists: false,
      serverError: false,
      badRequest: false
    });
  };

  onSectionNameChange = e => {
    console.log('onSectionNameChange', e.target.id, e.target.value)
    this.setState({
      [e.target.id] : e.target.value
    })
  }

  editFoodItem = e => {
    console.log('updating', e.target.value)
    this.props.history.push(`/food-item?id=${e.target.value}&edit=true`);
  };

  addFoodItem = e => {
    console.log('adding', e.target.value)
    this.props.history.push(`/food-item?&add=true&section=${e.target.value}`);
  };

  render() {
    let foodItemArr = this.state.foodItems.map(section => {
      return(
      <tr className="row">
        <td col s12 >
        <div class="divider"></div>
        <div class="section">
          <h5><input 
          value={section.name}
          required
          onChange={this.onSectionNameChange}
          id={section.name +`_`+section.name}
          type="text"/></h5>
          <button class="btn-floating" value={section.name} onClick={this.addFoodItem} style={{ marginTop: 30 }}>
          Add new food item to section 
            </button>
            {/* <button class="btn-floating" value={section.name} onClick={this.updateSection} style={{ marginTop: 30 }}>
          Update this section 
            </button> */}
            <button class="btn-floating" value={section.name} onClick={this.deleteSection} style={{ marginTop: 30 }}>
          Delete this section 
            </button>
            <p class="ff-inherit">Add new food item to section</p>
          <tr className="row">
            <td col s12 ><b>Item Name </b></td>
            <td col s12 ><b>Description </b></td>
            <td col s12 ><b>Price </b></td>
          </tr>
          <p>{ section.items.map((item) => {
                return (
                  <tr className="row">
                  <img src={`${constants.BASE_URL}/${item.image}`} alt="" height="40px" width="30px"></img>
                  <td col s12 >{item.name}</td>
                  <td col s12 >{item.description}</td>
                  <td col s12 >{item.price}</td>
                  <td><button value={item.id} onClick={this.editFoodItem}>Edit</button></td>
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
            {this.state.updateActionType && <p className="green-text text-darken-1">Food item has been updated</p>}
            {this.state.deleteActionType && <p className="red-text text-darken-1">Food item has been deleted</p>}
            {this.state.addActionType && <p className="green-text text-darken-1">Food item has been added</p>}
            {this.state.sectionDeletedText && <p className="red-text text-darken-1">Section and its food item have been deleted</p>}
            {this.state.sectionUpdatedText && <p className="green-text text-darken-1">Section name has been updated</p>}
            
            <button class="btn-floating" onClick={this.addSectionInput} style={{ marginTop: 30 }}>
              <i class="material-icons">add</i>
            </button>
            <p class="ff-inherit">Add new section to menu</p>

            {this.state.sectionInput && <form onSubmit={this.addSection}>
              <div className="input-field col s12">
                <input
                  required
                  onChange={this.onChange}
                  value={this.state.section}
                  id="section"
                  type="text"
                />
                <label htmlFor="name">Section</label>
              </div>
              <button class="btn waves-effect waves-light" type="submit">Add section to the menu</button>
              {this.state.sectionAddedText && <p className="green-text text-darken-1">
                Section added successfully.
              </p>}
              {this.state.sectionExists && <p className="red-text text-darken-1">
                This section already exists.
              </p>}
              {this.state.serverError && <p className="red-text text-darken-1">
                Server error!  Please try refreshing the page and try again.
              </p>}
              {this.state.badRequest && <p className="red-text text-darken-1">
                Bad request.
              </p>}
            </form>}

            {foodItemArr}
          </div>
        </div>

      </div>
    );
  }
}

export default compose(
  graphql(getFoodItemQuery, { name: "getFoodItemQuery" }),
)(RestaurantMenu)
