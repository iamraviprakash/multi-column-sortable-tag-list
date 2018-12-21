import React, { Component } from 'react';
import './App.css';
import ListContainer from './components/ListContainer';

class App extends Component {
  render() {
    return (
      <div className="container">
        <ul type="disc">
          <li>Things you're good at!</li>
        </ul>
        <form>
          <p>The skills you mention here will help hackathon organizers in assessing you as a potential participant.</p>
          <ListContainer />
        </form>
      </div>
    );
  }
}

export default App;
