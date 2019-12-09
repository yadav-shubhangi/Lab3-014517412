import React, { Component } from "react";
import classnames from "classnames";
import { graphql, compose } from 'react-apollo'
import { getProfile } from '../../queries/queries'
import { updateProfileMutation } from '../../mutation/mutations'

class Profile extends Component {
	constructor() {
		super();
		this.state = {
			errors: {},
			badRequest: false,
			serverError: false,
			buyerName: '',
			buyerEmailId: '',
			buyerContactNumber: '',
			password: '',
			confirmPassword: '',
			userType: '',
			profileImage: null,
			success: false
		};
	}

	componentDidMount() {
		console.log('in buyer home')
		if (localStorage.getItem('jwtToken') && localStorage.getItem('userType') === 'buyer' && localStorage.getItem('buyerId')) {
			console.log('logged in', localStorage.getItem('buyerId'))
			this.setState({
				userType: 'buyer'
			})
			let user = this.props.getProfile.allUsers
		} else {
			this.props.history.push("/login");
		}
	}

	onChange = e => {
		if (e.target.id === 'profileImage') {
			this.setState({ [e.target.id]: e.target.files[0] });
		} else {
			this.setState({ [e.target.id]: e.target.value });
		}
		console.log('this>> ', this.state)
	};

	onSubmit = e => {
		e.preventDefault();
		const updateBuyer = {
			name: this.state.buyerName,
			email: this.state.buyerEmailId,
			contactNumber: this.state.buyerContactNumber,
			type: this.state.userType
		};
		console.log('updateBuyer', updateBuyer)
		this.props.updateProfileMutation({
			variables: updateBuyer
		})
	}

	render() {
		const { errors } = this.state;

		return (
			<div className="container">
				<div className="row">
					<div className="landing-copy col s12 left-align">
						<h4>
							<b>Profile</b>
						</h4>
						<form onSubmit={this.onSubmit}>
							<label className="input-field col s12" htmlFor="name">Name</label>
							<div className="input-field col s12">
								<input
									required
									onChange={this.onChange}
									value={this.state.buyerName}
									error={errors.buyerName}
									id="buyerName"
									type="text"
									className={classnames("", {
										invalid: errors.buyerName
									})}
								/>
								<span className="red-text">{errors.buyerName}</span>
							</div>
							<label className="input-field col s12" htmlFor="email">Email</label>
							<div className="input-field col s12">
								<input
									required
									onChange={this.onChange}
									value={this.state.buyerEmailId}
									error={errors.buyerEmailId}
									id="buyerEmailId"
									type="email"
									disabled
									className={classnames("", {
										invalid: errors.buyerEmailId
									})}
								/>
								<span className="red-text">{errors.buyerEmailId}</span>
							</div>
							<label className="input-field col s12" htmlFor="email">Contact Number</label>
							<div className="input-field col s12">
								<input
									required
									onChange={this.onChange}
									value={this.state.buyerContactNumber}
									error={errors.buyerContactNumber}
									id="buyerContactNumber"
									type="text"
									className={classnames("", {
										invalid: errors.buyerContactNumber
									})}
								/>
								<span className="red-text">{errors.buyerContactNumber}</span>
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
									className="btn btn-large waves-effect waves-light hoverable blue mgn-bottom accent-3"
								>
									Update
                				</button>
								{this.state.serverError && <p className="red-text text-darken-1">
									Server error!  Please try refreshing the page and try again.
              					</p>}
								{this.state.badRequest && <p className="red-text text-darken-1">
									Bad request.
								  </p>}
								  {this.state.success && <p className="green-text text-darken-1">
									Profile updated succesfully.
              					</p>}
							</div>
						</form>
						<form onSubmit={this.uploadProfileImage}>
							<img src={this.state.profileImage} alt="" height="200px" width="150px"></img>
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

export default compose(
    graphql(updateProfileMutation, { name: "updateProfileMutation" }),
    graphql(getProfile, { name: "getProfile" }),
)(Profile)
