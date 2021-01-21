import React, { Component } from 'react';
import api from '../../services/api';
import './style.css';

import DoneRoundedIcon from '@material-ui/icons/DoneRounded';
import RemoveRoundedIcon from '@material-ui/icons/RemoveRounded';

class TodoFeed extends Component {
    state = {
        feed: [],
    };
    async componentDidMount() {
        const response = await api.get('todos');

        this.setState({ feed: response.data });
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
                <h2>TODO</h2>
                {this.state.feed.map(todo => (
                    <article key={todo._id}>
                        <h3>{todo.todo}</h3>
                        <div className="actions">
                            <DoneRoundedIcon className="done-icon" />
                            <RemoveRoundedIcon className="remove-icon" />
                        </div>
                    </article>


                ))}
            </section>
        )
    }
}

export default TodoFeed;