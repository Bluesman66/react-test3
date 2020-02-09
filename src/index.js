import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { apiResponse } from './apiResponse';
import JSONPretty from 'react-json-pretty';

const reducer = (state = apiResponse, action) => {
	return state;
}

const store = createStore(reducer);

ReactDOM.render(
	<Provider store={store}>
		<div>
			<JSONPretty json={store.getState()} />
		</div>
	</Provider>,
	document.getElementById('root'));