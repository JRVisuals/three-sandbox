import React from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Lighting } from '../scene/Elements';

import {
  createGround,
  createAllBars,
  createTargetCap,
} from '../scene/Geometry';

class Scene extends React.Component {
  componentDidMount() {
    this.initScene();
  }
  componentWillUnmount() {}

  initScene = () => {
    const { height, width, showHelpers } = this.props;

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 10000);
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.shadowMapEnabled = true;
    this.renderer.shadowMapSoft = true;

    this.renderer.setSize(width, height);

    this.mount.appendChild(this.renderer.domElement);

    camera.position.set(0, 0, 100);
    camera.lookAt(scene.position);

    const controls = new OrbitControls(camera, this.renderer.domElement);
    controls.listenToKeyEvents(window);
    // controls.enabled = true;
    // controls.maxDistance = 5000;
    // controls.minDistance = 0;
    // controls.update();

    const lightsObject = Lighting({ scene });
    scene.add(lightsObject.sceneLights);

    const cameraHelper = new THREE.CameraHelper(camera);

    if (showHelpers) {
      scene.add(cameraHelper);
      scene.add(lightsObject.sceneHelpers);
    }

    scene.add(createGround());
    scene.add(createAllBars());
    scene.add(createTargetCap());

    const animate = () => {
      requestAnimationFrame(animate);

      // required if controls.enableDamping or controls.autoRotate are set to true
      // controls.update();

      this.renderer.render(scene, camera);
    };
    //renderer.render( scene, camera );

    animate();
  };

  resetScene = () => {
    this.mount.removeChild(this.renderer.domElement);
    this.initScene();
  };

  render() {
    const renderScene = <div ref={(ref) => (this.mount = ref)} />;

    return (
      <div style={{ backgroundColor: '#282c34' }}>
        {renderScene}
        <div style={{ margin: 10 }}>
          <button onClick={this.resetScene} style={{ fontSize: 14 }}>
            Initialize Scene with Current Settings
          </button>
        </div>
      </div>
    );
  }
}

export default Scene;
