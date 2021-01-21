import React, { Component } from 'react';
import api from '../../services/api';
import './style.css';

import DoneRoundedIcon from '@material-ui/icons/DoneRounded';
import RemoveRoundedIcon from '@material-ui/icons/RemoveRounded';
import { Icon } from '@iconify/react';
import beachumbrellaIcon from '@iconify-icons/fxemoji/beachumbrella';

class TodoFeed extends Component {
    state = {
        feed: [],
    };

    async componentDidMount() {
        const response = await api.get('todos');
        const notDone = response.data.filter((todo) => {
            return todo.done === false;
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
                <h2>TODO</h2>
                {this.state.feed.map(todo => (
                    <article key={todo._id}>
                        <h3>{todo.todo}</h3>
                        <div className="actions">
                            <button type="button" onClick={() => this.handleDone(todo._id)}>
                                <DoneRoundedIcon className="done-icon" />
                            </button>
                            <button type="button" onClick={() => this.handleDelete(todo._id)}>
                                <RemoveRoundedIcon className="remove-icon" />
                            </button>
                        </div>
                    </article>
                ))}
                <div className="nada-div">
                    <Icon icon={beachumbrellaIcon} width="50" height="50" className="nada-icon" />
                    <h3 className="nada-text">Nada por aqui!</h3>
                </div>
            </section>
        )
    }
}

export default TodoFeed;