import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { apiResponse } from './apiResponse';
import JSONPretty from 'react-json-pretty';
import { schema, normalize } from 'normalizr';

const user = new schema.Entity('users');
const comment = new schema.Entity('comments', {
	author: user
});
const lesson = new schema.Entity('lesson', {
	comments: [comment]
})

const normalizedData = normalize(apiResponse, lesson);

const reducer = (state = normalizedData.entities, action) => {
	if (action.type === 'LIKE_COMMENT') {
		return {
			...state,
			comments: {
				...state.comments,
				[action.commentId]: {
					...state.comments[action.commentId],
					likes: state.comments[action.commentId].likes + 1
				}
			}
		}
	}
	return state;
}

const store = createStore(reducer);
window.store = store;

const renderApp = () => {
	ReactDOM.render(
		<Provider store={store}>
			<div>
				<JSONPretty json={store.getState()} />
			</div>
		</Provider>,
		document.getElementById('root'));
}

store.subscribe(renderApp);