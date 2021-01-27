import React, { useState, useEffect } from 'react';

// Drag an drop
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

// Title and input
import Header from './components/Header';
import AddTodo from './components/AddTodo';

// Connections to server
import api from './services/api';
import io from "socket.io-client";

// Icons
import DoneRoundedIcon from '@material-ui/icons/DoneRounded';
import RemoveRoundedIcon from '@material-ui/icons/RemoveRounded';
import { Icon } from '@iconify/react';
import beachumbrellaIcon from '@iconify-icons/fxemoji/beachumbrella';

// Handles live updates
const registerToSocket = (setItems) => {
  const socket = io('http://localhost:3333')

  // Handles new todo
  socket.on('todoItem', newTodo => {
    setItems((prevState) => {
      return [newTodo, ...prevState]
    })
  })

  // Handles what to do when 'done' is indicated by the server
  socket.on('done', currentItem => {
    setItems((prevState) => {
      prevState.forEach(function (item, i) {
        if (item._id === currentItem._id) {
          prevState.splice(i, 1);
          prevState.unshift(item);
        }
      })

      return prevState.map(e => {
        return {
          ...e,
          done: e._id === currentItem._id ? true : e.done,
        }
      })
    });
  })

  // Handles what to do when 'delete' is indicated by the server
  socket.on('delete', deleteTodo => {
    setItems((prevState) => {
      return prevState.filter(e => {
        return e._id !== deleteTodo._id;
      })
    })
  })
}

// Todo items
const MovableItem = ({ done, _id, todo, setItems }) => {
  // Switch the done state to true. Duplicated for faster response than waiting for server
  const changeItemColumn = (currentItem, columnName) => {
    setItems((prevState) => {
      prevState.forEach(function (item, i) {
        if (item._id === currentItem._id) {
          prevState.splice(i, 1);
          prevState.unshift(item);
        }
      })

      return prevState.map(e => {
        return {
          ...e,
          done: e._id === currentItem._id ? columnName : e.done,
        }
      })
    });
  }

  // Dragging behaviour
  const [{ isDragging }, drag] = useDrag({
    item: { _id, type: 'Our first type' },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      if (dropResult && dropResult.todo === 'DONE') {
        handleDone(item)
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // Handles what to do when 'done' is indicated by the user
  const handleDone = (currentItem) => {
    changeItemColumn(currentItem, true)
    api.post(`todos/${currentItem._id}`);
  }
  // Handles what to do when 'delete' is indicated by the user
  const handleDelete = (currentItem) => {
    api.delete(`todos/${currentItem._id}`);
  }

  const opacity = isDragging ? 0.4 : 1;

  // Different boxes for done and not done items
  if (done) {
    return (
      <div className='container'>
        <article key={_id}>
          <h3 className="done-text">{todo}</h3>
          <div className="actions">
            <button type="button" onClick={() => handleDelete({ _id, type: 'Our first type' })}>
              <RemoveRoundedIcon className="removedone-icon" />
            </button>
          </div>
        </article>
      </div>
    )
  } else {
    return (
      <div className='container' ref={drag} style={{ opacity }}>
        <article key={_id}>
          <h3>{todo}</h3>
          <div className="actions">
            <button type="button" onClick={() => handleDone({ _id, type: 'Our first type' })}>
              <DoneRoundedIcon className="done-icon" />
            </button>
            <button type="button" onClick={() => handleDelete({ _id, type: 'Our first type' })}>
              <RemoveRoundedIcon className="remove-icon" />
            </button>
          </div>
        </article>
      </div>
    )
  }
}

// Handles drop field behaviour and contents
const Column = ({ children, title }) => {
  const [, drop] = useDrop({
    accept: 'Our first type',
    drop: () => ({ todo: title }),
  });

  return (
    <div className="padding-botton" ref={drop}>
      <h2>{title}</h2>
      {children}
      <div className="nada-div" >
        <Icon icon={beachumbrellaIcon} width="50" height="50" className="nada-icon" />
        <h3 className="nada-text">Nada por aqui!</h3>
      </div >
    </div>
  )
}

function App() {
  const [items, setItems] = useState([]);

  // Starts the server connection
  useEffect(() => {
    registerToSocket(setItems);
    let mounted = true;
    api.get('todos').then(feed => {
      if (mounted) {
        var arrFeed = Object.values(feed)[0];
        setItems(arrFeed)
      }
    })
    return () => mounted = false;
  }, []);

  // Decides if an items goes to TODO or DONE field
  const returnItemsForColumn = (columnName) => {
    return items
      .filter((item) => item.done === columnName)
      .map((item) => (
        <MovableItem key={item._id}
          done={item.done}
          _id={item._id}
          todo={item.todo}
          setItems={setItems}
        />
      ))
  }

  return (
    <div className="App">
      <Header />
      <AddTodo />
      <div>
        {/* Wrap components that will be "draggable" and "droppable" */}
        <DndProvider backend={HTML5Backend}>
          <Column title='TODO'>
            {returnItemsForColumn(false)}
          </Column>
          <Column title='DONE'>
            {returnItemsForColumn(true)}
          </Column>
        </DndProvider>
      </div>
    </div>
  );
}

export default App;