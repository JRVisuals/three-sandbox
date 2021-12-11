import React from 'react';
import * as THREE from 'three';
import OrbitControls from 'threejs-orbit-controls';
import { Lighting } from '../scene/Elements';

import {
  createSimpleCube,
  // createGround,
  // createAllBars,
  // createTargetCap,
} from '../scene/Geometry';

class Scene extends React.Component {
  componentDidMount() {
    this.initScene();
  }
  componentWillUnmount() {}

  initScene = () => {
    const { height, width, showHelpers } = this.props;

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(50, 1, 1, 1000);
    this.renderer = new THREE.WebGLRenderer();
    //  this.renderer.shadowMapEnabled = true;
    //  this.renderer.shadowMapSoft = true;

    const loader = new THREE.TextureLoader();
    const bgTexture = loader.load('./img/hsb.png');
    scene.background = bgTexture;

    this.renderer.setSize(width, height);

    this.mount.appendChild(this.renderer.domElement);

    camera.position.set(0, 0, 200);
    camera.lookAt(scene.position);

    const controls = new OrbitControls(camera);
    controls.enabled = true;
    controls.maxDistance = 5000;
    controls.minDistance = 0;
    controls.update();

    scene.add(new THREE.AmbientLight(0xaaaaaa)); // soft white light

    scene.add(Lighting({ scene }).sceneLights);

    const simpleCube = createSimpleCube([2, -5, 0]);
    scene.add(simpleCube);

    const simpleCubeA = createSimpleCube([-100, 0, -100]);
    scene.add(simpleCubeA);

    const simpleCubeB = createSimpleCube([100, 0, -100]);
    scene.add(simpleCubeB);

    const animate = () => {
      requestAnimationFrame(animate);

      //   simpleCube.rotation.z -= 0.005;
      simpleCube.rotation.x -= 0.01;
      //  simpleCube.rotation.y -= 0.001;

      simpleCubeA.rotation.x += 0.005;
      simpleCubeB.rotation.x += 0.005;

      this.renderer.render(scene, camera);
    };

    animate();
  };

  resetScene = () => {
    this.mount.removeChild(this.renderer.domElement);
    this.initScene();
  };

  render() {
    const renderScene = <div ref={(ref) => (this.mount = ref)} />;

    return <>{renderScene}</>;
  }
}

export default Scene;
