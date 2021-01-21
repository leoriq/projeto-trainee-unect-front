import React, { Component } from 'react';
import api from '../../services/api';
import './style.css';

import RemoveRoundedIcon from '@material-ui/icons/RemoveRounded';

class DoneFeed extends Component {
    state = {
        feed: [],
    };

    async componentDidMount() {
        const response = await api.get('todos');
        const notDone = response.data.filter((todo) => {
            return todo.done === true;
          })

        this.setState({ feed: notDone });
    }

    handleDone = id => {
        api.post(`todos/${id}`);
    }

    handleDelete = id => {
        api.delete(`todos/${id}`);
    }

    render() {
        return (
            <section id="todo-list">
                <h2>DONE</h2>
                {this.state.feed.map(todo => (
                    <article key={todo._id}>
                        <h3>{todo.todo}</h3>
                        <div className="actions">
                            <button type="button" onClick={() => this.handleDelete(todo._id)}>
                                <RemoveRoundedIcon className="removedone-icon" />
                            </button>
                        </div>
                    </article>
                ))}
            </section>
        )
    }
}

export default DoneFeed;