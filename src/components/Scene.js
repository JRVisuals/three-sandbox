import React from 'react';
import * as THREE from 'three';
import OrbitControls from 'threejs-orbit-controls';
import { Lighting } from '../scene/Elements';

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from '../postprocess/TransparentBackgroundUnrealBloomPass';

import {
  createGlowCube,
  createSimpleCube,
  // createGround,
  // createAllBars,
  // createTargetCap,
} from '../scene/Geometry';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';

class Scene extends React.Component {
  componentDidMount() {
    this.initScene();
  }
  componentWillUnmount() {}

  initScene = () => {
    const { height, width, showHelpers } = this.props;

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(50, 1, 1, 1000);
    this.renderer = new THREE.WebGLRenderer({
      width: window.innerWidth,
      height: window.innerHeight,
      premultipliedAlpha: false,
      antialias: true,
    });

    this.renderer.shadowMapEnabled = true;
    this.renderer.shadowMapSoft = true;

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

    const cubeMaterialC = new THREE.MeshPhongMaterial({
      color: 0x00ffff,
      emissive: 0x0000ff,
      emissiveIntensity: 1.5,
    });

    const cubeMaterialM = new THREE.MeshPhongMaterial({
      color: 0xff00ff,
      emissive: 0xff55ff,
      emissiveIntensity: 0.5,
    });

    const cubeMaterialY = new THREE.MeshPhongMaterial({
      color: 0xffcc00,
      emissive: 0xff5500,
      emissiveIntensity: 0.5,
    });
    const cubeMaterialK = new THREE.MeshPhongMaterial({
      color: 0x000000,
      emissive: 0x000000,
    });

    const glowCubeC = createGlowCube([0, 30, 100], cubeMaterialC);
    scene.add(glowCubeC);

    const glowCubeM = createGlowCube([0, 10, 100], cubeMaterialM);
    scene.add(glowCubeM);

    const glowCubeY = createGlowCube([0, -10, 100], cubeMaterialY);
    scene.add(glowCubeY);

    const glowCubeK = createGlowCube([0, -30, 100], cubeMaterialK);
    scene.add(glowCubeK);

    let darkMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });

    // Post processing -- multipass

    // Render Pass
    this.renderPass = new RenderPass(scene, camera);

    // Bloom Pass
    this.bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      3.0,
      1.0,
      0.5
    );

    // OnePass Composer
    this.onePassComposer = new EffectComposer(this.renderer);
    this.onePassComposer.addPass(this.renderPass);
    this.onePassComposer.addPass(this.bloomPass);
    //

    // Bloom Composer
    this.bloomComposer = new EffectComposer(this.renderer);
    this.bloomComposer.setSize(window.innerWidth, window.innerHeight);
    this.bloomComposer.renderToScreen = false;
    //
    this.bloomComposer.addPass(this.renderPass);
    this.bloomComposer.addPass(this.bloomPass);

    // Shaders for Composite Pass
    const vertexShader = () => `
              	varying vec2 vUv;

			    void main() {

				    vUv = uv;

				    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

    			}
              `;
    const fragmentShader = () => `
                uniform sampler2D baseTexture;
			    uniform sampler2D bloomTexture;

			    varying vec2 vUv;

			    void main() {

				    gl_FragColor = ( texture2D( baseTexture, vUv ) + vec4( 1.0 ) * texture2D( bloomTexture, vUv ) );

			    }
              `;

    console.log(vertexShader());

    // Final Composite Pass

    this.compositePass = new ShaderPass(
      new THREE.ShaderMaterial({
        uniforms: {
          baseTexture: { value: null },
          bloomTexture: { value: this.bloomComposer.renderTarget2.texture },
        },
        vertexShader: vertexShader(),
        fragmentShader: fragmentShader(),
        defines: {},
      }),
      'baseTexture'
    );
    this.compositePass.needsSwap = false;

    // Composer for the Composite Pass
    this.compositeComposer = new EffectComposer(this.renderer);
    this.compositeComposer.addPass(this.renderPass);
    this.compositeComposer.addPass(this.compositePass);

    const animate = () => {
      requestAnimationFrame(animate);

      simpleCube.rotation.z -= 0.005;
      simpleCube.rotation.x -= 0.01;
      simpleCube.rotation.y -= 0.001;

      simpleCubeA.rotation.x += 0.005;
      simpleCubeB.rotation.x += 0.005;

      glowCubeC.rotation.z -= 0.2;
      glowCubeM.rotation.z -= 0.15;
      glowCubeY.rotation.z -= 0.1;
      glowCubeK.rotation.z -= 0.05;
      // straight up renderer
      //this.renderer.render(scene, camera);

      // post processeing version
      // this.onePassComposer.render();

      // MultiPass Selective Render ----

      // Store original material for geometry to skip bloom
      const saveMaterialSimple = simpleCubeA.material;
      // Set these to black (anything under the threshold would do honestly)
      simpleCube.material = darkMaterial;
      simpleCubeA.material = darkMaterial;
      simpleCubeB.material = darkMaterial;

      // Render bloom pass (offscreen, with darkened items)
      this.bloomComposer.render();

      // Reset the textures for previously darkened textures
      simpleCube.material = saveMaterialSimple;
      simpleCubeA.material = saveMaterialSimple;
      simpleCubeB.material = saveMaterialSimple;

      // Render the composit pass to vertex
      this.compositeComposer.render();

      //
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
