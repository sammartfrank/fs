import './style.css';

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import earth from './assets/earth.jpg';
import moon from './assets/moon.jpg';
import clouds from './assets/clouds.png';
import water from './assets/water.png';
import galaxy from './assets/galaxy.png';
import astro  from './assets/astro.jpg';
// Earth
const Earth = new THREE.SphereGeometry(0.5, 64, 64);
const material = new THREE.MeshPhongMaterial({
  map: new THREE.TextureLoader().load(earth),
  bumpMap: new THREE.TextureLoader().load(clouds),
  bumpScale: 0.00005,
  specularMap: new THREE.TextureLoader(water),
  specular: new THREE.Color('grey'),
  shininess: 2,
});
let earthObject = new THREE.Mesh(Earth, material);

// Moon
const Moon = new THREE.SphereGeometry(0.125, 32, 32);
const moonMaterial = new THREE.MeshPhongMaterial({
  map: new THREE.TextureLoader().load(moon),
});
let moonObject = new THREE.Mesh(Moon, moonMaterial);
9;
moonObject.position.x = 10;

// Clouds
const cloudsObject = new THREE.Mesh(
  new THREE.SphereGeometry(0.5 + 0.003, 32, 32),
  new THREE.MeshPhongMaterial({
    map: new THREE.TextureLoader().load(clouds),
    transparent: true,
  })
);

// Background
const background = new THREE.Mesh(
  new THREE.SphereGeometry(240, 64, 64),
  new THREE.MeshBasicMaterial({
    map: new THREE.TextureLoader().load(galaxy),
    side: THREE.BackSide,
  })
);

// Lighting
var ambientLight = new THREE.AmbientLight(0x333333);
var light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 3, 3);

// Camera
var camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  3000
);
camera.position.z = 1;

// Renderer
var renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Helpers
var gridHelper = new THREE.GridHelper(1000, 1000);
// var axesHelper = new THREE.AxesHelper(100);
// var lightHelper = new THREE.PointLightHelper(light);

// controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.maxDistance = 1000;
controls.minDistance = 1;
// Scene
var scene = new THREE.Scene();
scene.add(earthObject);
scene.add(moonObject);
scene.add(ambientLight);
scene.add(light);
scene.add(cloudsObject);
scene.add(background);

function addStars() {
  const geometry = new THREE.SphereGeometry(0.1, 24, 24);
  const material = new THREE.MeshStandardMaterial({
    color: 0xffffff,
  });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(1000));

  star.position.set(x, y, z);
  scene.add(star);
}

Array(500).fill().forEach(addStars);

// Handlers
function moveCamera() {
  const t = document.body.getBoundingClientRect().top;

  camera.position.x = t * -0.001;
  camera.position.y = t * -0.0001;
}

function animate() {
  requestAnimationFrame(animate);
  earthObject.rotation.y += 0.002;
  moonObject.rotation.y += 0.0001;
  cloudsObject.rotation.y += 0.0018;

  // Orbit
  moonObject.position.x = -10 * Math.cos(earthObject.rotation.y);
  moonObject.position.z = 10 * Math.sin(earthObject.rotation.y);

  controls.update();
  renderer.render(scene, camera);
}

// Document events
document.body.onscroll = moveCamera;

// runtime
animate();
addStars();
