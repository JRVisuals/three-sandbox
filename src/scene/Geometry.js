import * as THREE from 'three';

// Geometry --------

export const createSimpleCube = (offsets) => {
  const texture = new THREE.TextureLoader().load('./img/multipass.jpg');
  //const material = new THREE.MeshBasicMaterial( {  map: texture } );

  const loader = new THREE.CubeTextureLoader();
  loader.setPath('./img/');

  const reflectionCube = loader.load([
    'hsb.png',
    'hsb.png',
    'hsb.png',
    'hsb.png',
    'hsb.png',
    'hsb.png',
  ]);

  const cubeMaterial = new THREE.MeshLambertMaterial({
    color: 0x888888,
    map: texture,
    envMap: reflectionCube,
    combine: THREE.AddOperation,
    reflectivity: 0.25,
  });

  const cubeGeo = new THREE.BoxGeometry(80, 80, 80);
  const cube = new THREE.Mesh(cubeGeo, cubeMaterial);
  cube.position.set(...offsets);
  cube.rotation.z = (-45 * Math.PI) / 180;
  cube.rotation.x = (-35 * Math.PI) / 180;
  return cube;
};

export const createGlowCube = (offsets, cubeMaterial) => {
  const cubeGeo = new THREE.BoxGeometry(10, 10, 10);
  const cube = new THREE.Mesh(cubeGeo, cubeMaterial);
  cube.position.set(...offsets);
  cube.rotation.z = (-45 * Math.PI) / 180;
  cube.rotation.x = (-35 * Math.PI) / 180;
  return cube;
};
