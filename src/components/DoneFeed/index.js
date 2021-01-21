import React, { Component } from 'react';
import api from '../../services/api';
import io from "socket.io-client";
import './style.css';

import RemoveRoundedIcon from '@material-ui/icons/RemoveRounded';
import { Icon } from '@iconify/react';
import beachumbrellaIcon from '@iconify-icons/fxemoji/beachumbrella';

class DoneFeed extends Component {
    state = {
        feed: [],
    };

    async componentDidMount() {
        this.registerToSocket();

        const response = await api.get('todos');
        const done = response.data.filter((todo) => {
            return todo.done === true;
        })
        this.setState({ feed: done });
    }

    registerToSocket = () => {
        const socket = io('http://localhost:3333')

        socket.on('done', doneTodo => {
            this.setState({ feed: [doneTodo, ...this.state.feed] });
        })

        socket.on('delete', deleteTodo => {
            this.setState({
                feed: this.state.feed.filter((todo) => {
                    return todo._id !== deleteTodo._id;
                })
            })
        })
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
                        <h3 className="done-text">{todo.todo}</h3>
                        <div className="actions">
                            <button type="button" onClick={() => this.handleDelete(todo._id)}>
                                <RemoveRoundedIcon className="removedone-icon" />
                            </button>
                        </div>
                    </article>
                ))}
                <div className="nada-div">
                    <Icon icon={beachumbrellaIcon} width="50" height="50" className="nada-icon" />
                    <h3 className="nada-text">Nada por aqui!</h3>
                </div>
                <div style={{ marginBottom: 100 }}></div>
            </section>
        )
    }
}

export default DoneFeed;