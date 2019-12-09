import React, { Component } from "react";
import queryString from 'query-string';
import { graphql, compose } from 'react-apollo'
import { getFoodItemQuery } from '../../queries/queries'
import { addFoodItemMutation } from '../../mutation/mutations'


class FoodItem extends Component {
	constructor() {
		super();
		this.state = {
			foodItemId: '',
			badRequestClient: false,
			badRequest: false,
			serverError: false,
			notFound: false,
			name: '',
			description: '',
			price: '',
			image: null,
			actionType: '',
			status: ''
		};
	}

	componentWillMount() {
		if (!localStorage.getItem('jwtToken') || !localStorage.getItem('userType') === 'owner' || !localStorage.getItem('ownerId')) {
			this.props.history.push("/login");
		  }
		console.log('Food item page')
		const values = queryString.parse(this.props.location.search)
		console.log('values', values)
		if (values.id) {
			console.log('id')

			axios.get(`${constants.BASE_URL}/foodItems/item/${values.id}`)
				.then(res => {
					console.log('Response from fetching a fooditem api', res)
					if (res.status === 200) {
						this.setState({
							foodItemId: res.data.id
						})
						this.setState({
							name: res.data.name,
							description: res.data.description,
							price: res.data.price,
							image: `${constants.BASE_URL}/${res.data.image}` || null
						})
					}
					if (res.status === 404) {
						this.setState({
							notFound: true
						})
					}
				}).catch(err => {
					console.log('Error in fetching a fooditem api call', err, err.message)
					if (err.message.includes('500')) {
						this.setState({
							serverError: true
						})
					}
				})
		}
		if (values.edit === 'true') {
			this.setState({
				editMode: true
			})
		}
		if (values.add === 'true' && values.section) {
			this.setState({
				addMode: true,
				section: values.section
			})
		}
		console.log('id set', this.state.foodItemId)
	}

	addFoodItem = e => {
		e.preventDefault();
		if(!this.state.name || !this.state.description || !this.state.price || !this.state.section || !this.state.image) {
			console.log('hehehhehe')
			this.setState({
				badRequestClient: true
			})
			setTimeout(() => this.setState({ badRequestClient: false }), 3000);
			return ''
		}
		let newFoodItem = {
			name: this.state.name,
			description: this.state.description,
			price: this.state.price,
			sectionType: this.state.section
		}
		console.log('data and type', newFoodItem)
		this.props.parent.props.addFoodItemMutation({
			variables: newFoodItem
		})
	}

	onChange = e => {
		if (e.target.id === 'image') {
			console.log('here')
			this.setState({ [e.target.id]: e.target.files[0] });
		} else {
			this.setState({ [e.target.id]: e.target.value });
		}
		console.log('this>> ', this.state)
	};

	render() {
		return (
			<div className="container">
				<div className="row">
					<div className="col s8 offset-s2">
						<h4>
							<b>Food Item Details</b>
							<form onSubmit={this.updateFoodItem}>
								<label className="input-field col s12" htmlFor="name">Name</label>
								<div className="input-field col s12">
									<input
										required
										onChange={this.onChange}
										value={this.state.name}
										id="name"
										type="text"
									/>
								</div>
								<label className="input-field col s12" htmlFor="name">Description</label>
								<div className="input-field col s12">
									<input
										required
										onChange={this.onChange}
										value={this.state.description}
										id="description"
										type="text"
									/>
								</div>
								<label className="input-field col s12" htmlFor="name">Price</label>
								<div className="input-field col s12">
									<input
										required
										onChange={this.onChange}
										value={this.state.price}
										id="price"
										type="number"
									/>
								</div>
								{this.state.addMode && <input
									required
									onChange={this.onChange}
									id="image"
									type="file"
									name="file"
									accept="image/*"
								/>}
								{this.state.editMode && <div className="col s12" style={{ paddingLeft: "11.250px" }}>
									<button
										style={{
											width: "25%",
											borderRadius: "3px",
											letterSpacing: "1.5px",
											marginTop: "1rem"
										}}
										type="submit"
										value="update"
										className="btn btn-large waves-effect waves-light hoverable blue accent-3">
										Update
									</button>
									{this.state.serverError && <p className="red-text text-darken-1">
										Server error!  Please try refreshing the page and try again.
									</p>}
									{this.state.badRequest && <p className="red-text text-darken-1">
										Bad request.
									</p>}
								</div>}
								{this.state.editMode && <div className="col s12" style={{ paddingLeft: "11.250px" }}>
									<button
										style={{
											width: "25%",
											borderRadius: "3px",
											letterSpacing: "1.5px",
											marginTop: "1rem"
										}}
										onClick={this.deleteFoodItem}
										value="delete"
										className="btn btn-large waves-effect waves-light hoverable red accent-3">
										Delete
									</button>
									{this.state.serverError && <p className="red-text text-darken-1">
										Server error!  Please try refreshing the page and try again.
									</p>}
									{this.state.badRequest && <p className="red-text text-darken-1">
										Bad request.
									</p>}
								</div>}

								{this.state.addMode && <div className="col s12" style={{ paddingLeft: "11.250px" }}>
									<button
										style={{
											width: "25%",
											borderRadius: "3px",
											letterSpacing: "1.5px",
											marginTop: "1rem"
										}}
										onClick={this.addFoodItem}
										value="add"
										className="btn btn-large waves-effect waves-light hoverable green accent-3">
										Add
									</button>
									{this.state.serverError && <p className="red-text text-darken-1">
										Server error!  Please try refreshing the page and try again.
									</p>}
									{this.state.badRequest && <p className="red-text text-darken-1">
										Bad request.
									</p>}
									
									{this.state.badRequestClient && <p className="red-text text-darken-1">
										All fields are required.
									</p>}
								</div>}
							</form>
							{this.state.editMode && <form onSubmit={this.uploadFoodItemImage}>
								<img src={this.state.image} alt="" height="200px" width="150px"></img>
								<input
									required
									onChange={this.onChange}
									id="image"
									type="file"
									name="file"
									accept="image/*"
								/>
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
									Upload
								</button>
							</form>}
						</h4>
					</div>
				</div>
			</div>
		);
	}
}

export default compose(
	graphql(getFoodItemQuery, { name: "getFoodItemQuery" }),
  )(FoodItem)
