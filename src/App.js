import React from 'react';

import Header from './components/Header';
import AddTodo from './components/AddTodo';
import TodoFeed from './components/TodoFeed';
import DoneFeed from './components/DoneFeed';


function App() {
  return (
    <div className="App">
      <Header />
      <AddTodo />
      <TodoFeed />
      <DoneFeed />
    </div>
  );
}

export default App;
