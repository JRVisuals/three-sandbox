import React, { useState } from 'react';
import './App.css';

import Scene from './components/Scene';
import SettingsPanel from './components/SettingsPanel';

// import AppContext from './context';

const App = () => {
  return (
    <div className='App'>
      <div
        style={{
          height: 40,
          marginBottom: 20,
          marginLeft: 20,
          fontSize: 18,
          fontWeight: 800,
        }}
      >
        <br />
        Multipass Selective Shader
      </div>

      <div className='Sandbox'>
        <Scene width='800' height='800' />
      </div>
    </div>
  );
};

export default App;
