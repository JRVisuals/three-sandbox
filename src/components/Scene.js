import React from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Lighting } from '../scene/Elements';

import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { SparkShader } from '../shaders/SparkShader';
import { UnrealBloomPass } from '../shaders/TransparentBackgroundUnrealBloomPass';

import {
  createGround,
  createAllBars,
  createTargetCap,
} from '../scene/Geometry';

class Scene extends React.Component {
  componentDidMount() {
    this.renderer = new THREE.WebGLRenderer();
    this.initScene();
  }
  componentWillUnmount() {}

  initScene = () => {
    const { height, width, showHelpers, renderBloom } = this.props;

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 10000);

    this.renderer.shadowMap.enabled = true;
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

    // Postprocessing Pass -----

    // Render Scene
    this.renderScene = new RenderPass(scene, camera);
    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(this.renderScene);

    // Render Bloom
    if (renderBloom) {
      const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(96, 96),
        1.5,
        1.75,
        0.6
      );

      bloomPass.renderToScreen = false;
      this.composer.addPass(bloomPass);
    }

    // Render Sparks
    // this.sparksPass = new ShaderPass(SparkShader);
    // this.composer.addPass(this.sparksPass);
    // this.sparksPass.uniforms.u_resolution.value = {
    //   x: this.myWidth,
    //   y: this.myHeight,
    // };
    // this.sparkLevels = [
    //   { str: 0.09, spd: 3.0 },
    //   { str: 0.06, spd: 4.0 },
    //   { str: 0.03, spd: 5.0 },
    //   { str: 0.01, spd: 6.0 },
    // ];

    // Animate is basically the render loop...

    const animate = () => {
      requestAnimationFrame(animate);

      // required if controls.enableDamping or controls.autoRotate are set to true
      // controls.update();

      // Render by Camera
      // this.renderer.render(scene, camera);
      // Render by Composer (allows for multi-pass rendering)
      this.composer.render(scene, camera);
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

    return <div style={{ backgroundColor: '#282c34' }}>{renderScene}</div>;
  }
}

export default Scene;
