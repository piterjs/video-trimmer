import React from 'react';
import { BrowserRouter as Router, Switch } from 'react-router-dom';

import Header from './components/Header';
import Page from './components/Page';
import Home from './components/Home';
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
        <Page path="/" exact component={Home} title="Video trimmer"/>
        <Page path="/history/" exact component={HistoryList} title="History"/>
        <Page path="/history/:id" exact component={HistoryView} title="History - slice stream"/>
        <Page path="/history/:id/:build_id" component={ViewLog} title="History - build"/>
        <Page path="/add" component={AddNew} title="Slice stream" />
        <Page render={ () => <div className="wrapper"><h1>404 Error</h1></div> } />
      </Switch>
    </Router>
  );
}
export default App;
