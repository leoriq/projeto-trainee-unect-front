import React, { useState, useEffect } from 'react';

import Header from './components/Header';
import AddTodo from './components/AddTodo';
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import api from './services/api';
import io from "socket.io-client";

import DoneRoundedIcon from '@material-ui/icons/DoneRounded';
import RemoveRoundedIcon from '@material-ui/icons/RemoveRounded';
import { Icon } from '@iconify/react';
import beachumbrellaIcon from '@iconify-icons/fxemoji/beachumbrella';

const MovableItem = ({ done, _id, todo, setItems }) => {

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

  const deleteItem = (currentItem) => {
    setItems((prevState) => {
      return prevState.filter(e => {
        return e._id !== currentItem._id;
      })
    })
  }

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

  const handleDone = (currentItem) => {
    changeItemColumn(currentItem, true)
    api.post(`todos/${currentItem._id}`);
  }

  const handleDelete = (currentItem) => {
    api.delete(`todos/${currentItem._id}`);
  }

  const opacity = isDragging ? 0.4 : 1;

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

const Column = ({ children, title }) => {
  const [, drop] = useDrop({
    accept: 'Our first type',
    drop: () => ({ todo: title }),
  });

  return (
    <div ref={drop}>
      <h2>{title}</h2>
      {children}
      <div className="nada-div" >
        <Icon icon={beachumbrellaIcon} width="50" height="50" className="nada-icon" />
        <h3 className="nada-text">Nada por aqui!</h3>
      </div >
    </div>
  )
}

const registerToSocket = () => {
  const socket = io('http://localhost:3333')

  socket.on('todoItem', newTodo => {
      this.setState({ feed: [newTodo, ...this.state.feed] });
  })

  socket.on('done', doneTodo => {
      console.log(doneTodo);
      this.setState({
          feed: this.state.feed.filter((todo) => {
              return todo._id !== doneTodo._id;
          })
      })
  })

  socket.on('delete', deleteTodo => {
    MovableItem.deleteItem({ _id: deleteTodo._id, type: 'Our first type' })
  })
}

function App() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    registerToSocket();
    let mounted = true;
    api.get('todos').then(feed => {
      if (mounted) {
        var arrFeed = Object.values(feed)[0];
        setItems(arrFeed)
      }
    })
    return () => mounted = false;
  }, []);

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