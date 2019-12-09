import React, { Component } from "react";
import classnames from "classnames";
import constants from '../../utils/constants'
import { graphql, compose } from 'react-apollo'
import { getFoodItemQuery } from '../../queries/queries'

class RestaurantHome extends Component {
	constructor() {
		super();
		this.state = {
			restaurant: '',
			owner: '',
			errors: {},
			userExists: false,
			badRequest: false,
			serverError: false,
			ownerName: '',
			ownerEmailId: '',
			ownerContactNumber: '',
			restaurantId: '',
			restaurantName: '',
			cuisine: '',
			password: '',
			confirmPassword: '',
			userType: '',
			profileImage: null, //Need to do
			restaurantImage: null  //Need to do
		};
	}

	componentDidMount() {
		console.log('in restaurant home')
		if (localStorage.getItem('jwtToken') && localStorage.getItem('userType') === 'owner' &&  localStorage.getItem('ownerId')) {
			console.log('logged in', localStorage.getItem('ownerId'))
			this.setState({
				userType: 'owner'
			})
		}
	}

	onChange = e => {
		if (e.target.id === 'profileImage' || e.target.id === 'restaurantImage') {
			this.setState({ [e.target.id]: e.target.files[0] });
		} else {
			this.setState({ [e.target.id]: e.target.value });
		}
		console.log('this>> ', this.state)
	};

	onSubmit = e => {
		e.preventDefault();
		const updateOwner = {
			name: this.state.ownerName,
			email: this.state.ownerEmailId,
			contactNumber: this.state.ownerContactNumber,
			type: this.state.userType,
			restaurantName: this.state.restaurantName,
			cuisine: this.state.cuisine,
			restaurantId: this.state.restaurantId
		};
		console.log('updateOwner', updateOwner)
		axios
			.put(`${constants.BASE_URL}/users/profile/${localStorage.getItem('ownerId')}`, updateOwner)
			.then(res => {
				console.log('res.data', res)
			})
			.catch(err => {
				console.log('Error in updating user api call', err, err.message)
				if (err.message.includes('400')) {
					this.setState({
						badRequest: true
					})
				}
				if (err.message.includes('409')) {
					this.setState({
						userExists: true
					})
				}
				if (err.message.includes('500')) {
					this.setState({
						serverError: true
					})
				}
			});
	}

	render() {
		const { errors } = this.state;

		return (
			<div className="container valign-wrapper">
				<div className="row">
					<div className="landing-copy col s12 left-align">
						<h4>
							<b>{this.state.restaurant.name}</b>
						</h4>
						<form onSubmit={this.onSubmit}>
						<label className="input-field col s12" htmlFor="name">Name</label>
							<div className="input-field col s12">
								<input
									required
									onChange={this.onChange}
									value={this.state.ownerName}
									error={errors.ownerName}
									id="ownerName"
									type="text"
									className={classnames("", {
										invalid: errors.ownerName
									})}
								/>
								<span className="red-text">{errors.ownerName}</span>
							</div>
							<label className="input-field col s12" htmlFor="email">Email</label>
							<div className="input-field col s12">
								<input
									required
									onChange={this.onChange}
									value={this.state.ownerEmailId}
									error={errors.ownerEmailId}
									id="ownerEmailId"
									type="email"
									className={classnames("", {
										invalid: errors.ownerEmailId
									})}
								/>
								<span className="red-text">{errors.ownerEmailId}</span>
							</div>
							<label className="input-field col s12" htmlFor="email">Contact Number</label>
							<div className="input-field col s12">
								<input
									required
									onChange={this.onChange}
									value={this.state.ownerContactNumber}
									error={errors.ownerContactNumber}
									id="ownerContactNumber"
									type="text"
									className={classnames("", {
										invalid: errors.ownerContactNumber
									})}
								/>
								<span className="red-text">{errors.ownerContactNumber}</span>
							</div>
							<div>
								<label className="input-field col s12" htmlFor="restaurantName">Restaurant Name</label>
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
									<span className="red-text">{errors.restaurantName}</span>
								</div>
								<label className="input-field col s12" htmlFor="cuisine">Cusine</label>
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
									<span className="red-text">{errors.cuisine}</span>
								</div>
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
									className="btn btn-large waves-effect waves-light hoverable blue accent-3 mgn-bottom"
								>
									Update
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
							</div>
						</form>
						<label className="input-field col s12" htmlFor="profileImage">Profile Image</label>
						<form onSubmit={this.uploadProfileImage}>
							<img src={this.state.profileImage} alt="Oops!" height="200px" width="150px"></img>
							<input
								required
								onChange={this.onChange}
								id="profileImage"
								type="file"
								name="file"
								accept="image/*"
								className="block"
							/>
							<button
								style={{
									width: "150px",
									borderRadius: "3px",
									letterSpacing: "1.5px",
									marginTop: "1rem"
								}}
								type="submit"
								className="btn btn-large waves-effect waves-light hoverable blue accent-3 mgn-bottom"
							>
								Upload
						</button>
						</form>
						<label className="input-field col s12" htmlFor="profileImage">Restaurant Image</label>						
						<form onSubmit={this.uploadRestaurantImage}>
							<img src={this.state.restaurantImage} alt="Oops!" height="200px" width="150px"></img>
							<input
								required
								onChange={this.onChange}
								id="restaurantImage"
								type="file"
								name="file"
								accept="image/*"
								className="block"
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
						</form>
					</div>
				</div>
			</div>
		);
	}
}

export default RestaurantHome
export default compose(
    graphql(getFoodItemQuery, { name: "getFoodItemQuery" }),
)(RestaurantHome)
