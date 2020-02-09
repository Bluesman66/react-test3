import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { apiResponse } from './apiResponse';
//import JSONPretty from 'react-json-pretty';
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
		const { comments } = state;
		const { commentId: id } = action;
		return {
			...state,
			comments: {
				...comments,
				[id]: {
					...comments[id],
					likes: comments[id].likes + 1
				}
			}
		}
	}

	if (action.type === 'EDIT_COMMENT') {
		const { comments } = state;
		const { commentId: id, text } = action;
		return {
			...state,
			comments: {
				...comments,
				[id]: {
					...comments[id],
					text
				}
			}
		}
	}

	return state;
}

const store = createStore(reducer);
window.store = store;

const renderApp = () => {
	const comments = store.getState().comments;
	const users = store.getState().users;
	ReactDOM.render(
		<Provider store={store}>
			<div>
				{Object.keys(comments).map(c => {
					return <div style={{padding: 10, border: '1px solid #999', marginBottom: 30}} key={c}>
						<p style={{marginTop: 10, fontSize: 16}}>
							Author: {' '}
							<span style={{fontWeight: 'bold'}}>
								{users[comments[c].author].name}
							</span>
						</p>
						{comments[c].text}
						<br />
						<br />
						<span style={{color: 'green'}}>Likes: {comments[c].likes}</span>
						<span style={{display: 'inline-block', width: 30}}></span>
						<span style={{color: 'red'}}>Dislikes: {comments[c].dislikes}</span>
					</div>
				})}
			</div>
		</Provider>,
		document.getElementById('root'));
}

store.subscribe(renderApp);