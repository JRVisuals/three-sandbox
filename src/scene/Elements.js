import * as THREE from 'three';

export const Lighting = (props) => {
  const sceneLights = new THREE.Group();
  const sceneHelpers = new THREE.Group();

  var ambientLight = new THREE.AmbientLight(0xffffff, 0.1); // soft ambient light
  sceneLights.add(ambientLight);

  // Spotlight 1 --------------------
  // --------------------------------

  const spotLight = new THREE.SpotLight(0xffffff, 5);
  spotLight.distance = 100;
  spotLight.decay = 1.0;

  spotLight.lookAt(props.scene.position);

  spotLight.position.set(-100, 120, 250);
  spotLight.target.position.set(0, 50, -60);
  spotLight.penumbra = 0.15;
  spotLight.angle = 0.3;

  spotLight.castShadow = true;

  spotLight.shadow.mapSize.width = 1024;
  spotLight.shadow.mapSize.height = 1024;

  spotLight.shadow.camera.near = 1;
  spotLight.shadow.camera.far = 400;
  spotLight.shadow.camera.fov = 55;

  sceneLights.add(spotLight);
  sceneLights.add(spotLight.target);

  // Spotlight 2 --------------------
  // --------------------------------

  const spotLightTwo = new THREE.SpotLight(0xff7700, 0.75);
  spotLightTwo.distance = 400;
  spotLightTwo.decay = 1.5;

  spotLightTwo.position.set(-200, 100, 200);
  spotLightTwo.target.position.set(0, 0, 0);
  spotLightTwo.penumbra = 0.8;
  spotLightTwo.angle = 0.22;

  spotLightTwo.castShadow = false;

  spotLightTwo.shadow.mapSize.width = 1024;
  spotLightTwo.shadow.mapSize.height = 1024;

  spotLightTwo.shadow.camera.near = 1;
  spotLightTwo.shadow.camera.far = 400;
  spotLightTwo.shadow.camera.fov = 55;

  //  sceneLights.add(spotLightTwo);
  //  sceneLights.add(spotLightTwo.target);

  // Spotlight 3 --------------------
  // --------------------------------

  const spotLightThree = new THREE.SpotLight(0x000080, 0.5);
  spotLightThree.distance = 400;
  spotLightThree.decay = 1.5;

  spotLightThree.position.set(350, -100, -100);
  spotLightThree.target.position.set(0, -20, -10);
  spotLightThree.penumbra = 0.75;
  spotLightThree.angle = 0.2;

  spotLightThree.castShadow = false;

  spotLightThree.shadow.mapSize.width = 1024;
  spotLightThree.shadow.mapSize.height = 1024;

  spotLightThree.shadow.camera.near = 1;
  spotLightThree.shadow.camera.far = 400;
  spotLightThree.shadow.camera.fov = 50;

  //  sceneLights.add(spotLightThree);
  //  sceneLights.add(spotLightThree.target);

  // Scene Helpers --------------------
  // ----------------------------------

  // var axeshelper = new THREE.AxesHelper( 5 );
  // sceneHelpers.add( axeshelper );

  //   var spotLightHelper = new THREE.SpotLightHelper( spotLight, 0x888888 );
  //  var shadowCameraHelper = new THREE.CameraHelper( spotLight.shadow.camera );
  //  sceneHelpers.add( spotLightHelper );
  //  sceneHelpers.add( shadowCameraHelper );

  //  var spotLightHelperTwo = new THREE.SpotLightHelper( spotLightTwo, 0xFFFF00 );
  //  var shadowCameraHelperTwo = new THREE.CameraHelper( spotLightTwo.shadow.camera );
  // sceneHelpers.add( spotLightHelperTwo );
  // sceneHelpers.add( shadowCameraHelperTwo );

  var spotLightHelperThree = new THREE.SpotLightHelper(
    spotLightThree,
    0x0000ff
  );
  var shadowCameraHelperThree = new THREE.CameraHelper(
    spotLightThree.shadow.camera
  );
  sceneHelpers.add(spotLightHelperThree);
  sceneHelpers.add(shadowCameraHelperThree);

  const lightObject = { sceneLights, sceneHelpers };

  return lightObject;
};
