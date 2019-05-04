import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Header from './components/Header';

import AddNew from './components/Add';
import HistoryList from './components/HistoryList';
import HistoryView from './components/HistoryView';
import ViewLog from './components/ViewLog';

import './App.css';

function App() {
  return (
    <Router>
      <Header/>
      <Switch>
        <Route path="/" exact component={HistoryList} />
        <Route path="/history/:id" exact component={HistoryView} />
        <Route path="/history/:id/:build_id" component={ViewLog} />
        <Route path="/add" component={AddNew} />
      </Switch>
    </Router>
  );
}
export default App;
