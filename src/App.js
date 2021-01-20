import React from 'react';

import Header from './components/Header';
import AddTodo from './components/AddTodo';
import TodoFeed from './components/TodoFeed';


function App() {
  return (
    <div className="App">
      <Header />
      <AddTodo />
      <TodoFeed />
    </div>
  );
}

export default App;
