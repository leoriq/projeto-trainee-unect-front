import React, { Component } from 'react';
import api from '../../services/api';
import './index.css';

import PlusOutlined from '@ant-design/icons/PlusOutlined';

class AddTodo extends Component {
  state = {
    todo: '',
  };

  handleChange = e => {
    this.setState({ todo: e.target.value });
  }

  handleSubmit = async e => {
    const data = new FormData();

    data.append('todo', this.state.todo);

    await api.post('todos', data);
    document.getElementById("input").value = "";
  }


  render() {
    return (
      <div className="addTodo">
        <div className="addTodo-Input">

          <input
            id="input"
            type="text"
            placeholder="Add uma nova tarefa"
            onChange={this.handleChange}
            value={this.state.todo}
          />
          <button type="button" onClick={this.handleSubmit} >
            <PlusOutlined width="18px" height="18px" className="add-icon" />
          </button>

        </div>
      </div>
    );
  }
}

export default AddTodo;