import * as THREE from 'three';
import GUI from 'lil-gui'; 
import Stats from 'three/addons/libs/stats.module.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import vertexShader from './shaders/vertex.glsl?raw';
import fragmentShader from './shaders/fragment.glsl?raw';

// https://threejs.org/manual/#en/installation

// tutorial from here: https://youtu.be/oKbCaj1J6EI?si=LQo_a9qhDb_ztYgn

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );

var controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true;

const gui = new GUI();
gui.add( document, 'title' );

const stats = new Stats();
document.body.appendChild(stats.dom)

// lighting
const dirLight = new THREE.DirectionalLight('#ffffff', 0.75)
dirLight.position.set(5, 5, 5)

const ambientLight = new THREE.AmbientLight('#ffffff', 0.2)
scene.add(dirLight, ambientLight)

// plane
const planeGeometry = new THREE.PlaneGeometry(1, 1);
const planeMaterial = new THREE.MeshBasicMaterial( { color: 0x0000ff } );
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.position.set(-2, 0, 0);
scene.add(plane);

// cube
const cubeGeometry = new THREE.BoxGeometry( 1, 1, 1 );
console.log(cubeGeometry.attributes);
const cubeMaterial = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( cubeGeometry, cubeMaterial );
scene.add( cube );

// icosahedron
const icoGeometry = new THREE.IcosahedronGeometry(1, 1);
const icoMaterial = new THREE.ShaderMaterial({
    vertexShader: vertexShader,    
    fragmentShader: fragmentShader,
    // attributes: vertex specific

    // uniforms: global (set for all vertexes / fragments)
    uniforms: {
        uTime: {value: 0.0}
    }

    // varying: sends info between vertex and fragment shader
});
const ico = new THREE.Mesh(icoGeometry, icoMaterial)
ico.position.set(2, 0, 0);
scene.add(ico)

camera.position.z = 5;

function animate() {
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  renderer.render( scene, camera );

  stats.update();
}