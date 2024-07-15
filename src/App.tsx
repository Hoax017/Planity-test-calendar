import React from 'react';
import events from './input.json';
import {Calendar} from "./components/Calendar/Calendar";


function App() {
  return (
    <Calendar events={events}/>
  );
}

export default App;
