import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Header from './components/Header';

import Index from './components/Index';
import HistoryList from './components/HistoryList';

import './App.css';

function HistoryView() {
  return <h1>Titile</h1>;
}

function App() {
  return (
    <Router>
      <Header/>
      <Switch>
        <Route path="/" exact component={Index} />
        <Route path="/history" component={HistoryList} />
        <Route path="/history/:id" component={HistoryView} />
      </Switch>
    </Router>
  );
}
export default App;
