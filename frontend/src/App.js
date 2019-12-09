import React, { Component } from 'react';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import { BrowserRouter } from 'react-router-dom';

// components
import Main from './components/Main';


// apollo client setup
const client = new ApolloClient({
	uri: 'http://localhost:8080/graphql'
});

class App extends Component {
	render() {
		return (
			<ApolloProvider client={client}>
				<BrowserRouter>

					<div id="root">
						<Main />
					</div>
				</BrowserRouter>
			</ApolloProvider>
		);
	}
}
export default App;