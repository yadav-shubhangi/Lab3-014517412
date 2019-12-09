import React, { Component } from "react";
import axios from "axios";
import constants from '../../utils/constants'
import queryString from 'query-string'

class SearchResults extends Component {
  constructor() {
    super();
    this.state = {
      search: "",
      results: [],
      cuisine: "",
      filteredResults: [],
      filter: false,
      noResults: false
    };
  }

  componentDidMount() {
    if (!localStorage.getItem('jwtToken') || !localStorage.getItem('userType') === 'buyer' || !localStorage.getItem('buyerId')) {
      this.props.history.push("/login");
    }
    const values = queryString.parse(this.props.location.search)
    console.log('valuess-->', values)
    axios
      .get(`${constants.BASE_URL}/foodItems?search=${values.search}`)
      .then(res => {
        console.log('res.data', res.data)
        if (res.status === 200) {
          this.setState({
            results: this.state.results.concat(res.data)
          })
          console.log('state.results', this.state.results)
        }
        if (res.status === 204) {
          this.setState({
            noResults: true
          })
        }
      })
      .catch(err => {
        console.log('Error in getting search results-->', err.message, err)
      });
    }

    openRestuarantPage = (restaurantId, e) => {
        console.log('opening page', e.target.value, restaurantId)
        this.props.history.push(`/restaurant/${restaurantId}`)
    }

  onChange = e => {
    this.setState({
      [e.target.id]: e.target.value
    })
  }

    filterResults = e => {
      e.preventDefault();
      var cuisine = this.state.cuisine
      if(this.state.cuisine){
        let filteredResults = this.state.results.filter(function (res) {
          return res.cuisine.toLowerCase() === cuisine.toLowerCase(); 
        });
        console.log('filtered results', filteredResults)
        this.setState({
          filter: true,
          filteredResults: filteredResults
        })
      } else {
        this.setState({
          filter: false
        })
      }
    }

  render() {
    let resultArr = this.state.results.map(result => {
      return(
               <div onClick={this.openRestuarantPage.bind(this, result.id)} class="col s12 m7">
                <div class="card horizontal">
                <div class="card-image">
                    <img src={`${constants.BASE_URL}/${result.restaurantImage}`}/>
                </div>
                <div class="card-stacked">
                    <div class="card-content">
                    <div>{result.name}</div>
                    <p>{result.zipcode}</p>
                    </div>
                    <div class="card-action">
                    <p>{result.cuisine}</p>                    
                    </div>
                </div>
                </div>
            </div>
      )
  })

  let filterArr = this.state.filteredResults.map(result => {
    return(
             <div onClick={this.openRestuarantPage.bind(this, result.id)} class="col s12 m7">
              <div class="card horizontal">
              <div class="card-image">
                  <img src={`${constants.BASE_URL}/${result.restaurantImage}`}/>
              </div>
              <div class="card-stacked">
                  <div class="card-content">
                  <div>{result.name}</div>
                  <p>{result.zipcode}</p>
                  </div>
                  <div class="card-action">
                  <p>{result.cuisine}</p>                    
                  </div>
              </div>
              </div>
          </div>
    )
})

    return (
      <div className="container">
        <div className="row">
          <div className="landing-copy col s12 center-align">
            <div>
              <form onSubmit={this.filterResults}>
                <input
                  onChange={this.onChange}
                  // value={this.state.cuisine}
                  id="cuisine"
                  type="text"
                />
                <button type="submit">Filter</button>
              </form>
            </div>
            <h4>
              <b>Search Results</b>
            </h4>
            {!this.state.filter && !this.state.noResults && <div>{resultArr}</div>}
            {this.state.filter && !this.state.noResults && <div>{filterArr}</div>}
            {this.state.noResults && <div>No results found.</div>}
          </div>
        </div>
      </div>
    );
  }
}

export default SearchResults
