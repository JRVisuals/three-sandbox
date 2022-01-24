import React, { useState, useEffect, useRef } from 'react';
import './App.css';

import Scene from './components/Scene';
import SettingsPanel from './components/SettingsPanel';

import AppContext from './context';

const App = () => {
  const [autoUpdate, setAutoUpdate] = useState(true);
  const toggleAutoUpdate = () => setAutoUpdate(!autoUpdate);

  const [showHelpers, setShowHelpers] = useState(true);
  const toggleShowHelpers = () => setShowHelpers(!showHelpers);

  const [renderBloom, setRenderBloom] = useState(true);
  const toggleRenderBloom = () => setRenderBloom(!renderBloom);

  useEffect(() => {
    autoUpdate && sceneRef.current.resetScene();
  });

  const sceneRef = useRef();
  const settingsRef = useRef();

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
        React THREE.JS Sandbox
      </div>

      <div className='Sandbox'>
        <SettingsPanel
          ref={settingsRef}
          toggleAutoUpdate={() => toggleAutoUpdate()}
          toggleShowHelpers={() => toggleShowHelpers()}
          toggleRenderBloom={() => toggleRenderBloom()}
          resetScene={() => sceneRef.current.resetScene()}
          autoUpdate={autoUpdate}
          showHelpers={showHelpers}
          renderBloom={renderBloom}
        />

        <Scene
          ref={sceneRef}
          width='800'
          height='800'
          autoUpdate={autoUpdate}
          showHelpers={showHelpers}
          renderBloom={renderBloom}
        />
      </div>
    </div>
  );
};

export default App;
