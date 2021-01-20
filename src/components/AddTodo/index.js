import React from 'react';
import './index.css';

import AddIcon from '@material-ui/icons/Add';

export default function AddTodo() {
  return(
    <div className="addTodo">
      <div className="addTodo-Input">
        
        <input type="text" placeholder="Add uma nova tarefa" />
        <AddIcon 
          fontSize="madium"
          style={{
            cursor: 'pointer'
          }}
        />
        
      </div>
    </div>
  );
}