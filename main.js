import * as THREE from 'three';
import GUI from 'lil-gui'; 
import Stats from 'three/addons/libs/stats.module.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import planeVertexShader from './shaders/plane/vertex.glsl?raw';
import planeFragmentShader from './shaders/plane/fragment.glsl?raw';

import icoVertexShader from './shaders/icosahedron/vertex.glsl?raw';
import icoFragmentShader from './shaders/icosahedron/fragment.glsl?raw';

import sphereVertexShader from './shaders/sphere/vertex.glsl?raw';
import sphereFragmentShader from './shaders/sphere/fragment.glsl?raw';


// https://threejs.org/manual/#en/installation

// tutorial from here: https://youtu.be/oKbCaj1J6EI?si=LQo_a9qhDb_ztYgn

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor(0x101114);
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );

var controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true;

const gui = new GUI();
gui.add( document, 'title' );
gui.add( camera.position, 'z', -10, 10, 1);

const stats = new Stats();
document.body.appendChild(stats.dom)

// lighting
const dirLight = new THREE.DirectionalLight('#ffffff', 0.75)
dirLight.position.set(5, 5, 5)

const ambientLight = new THREE.AmbientLight('#ffffff', 0.2)
scene.add(dirLight, ambientLight)

// plane
const planeGeometry = new THREE.PlaneGeometry(2, 2, 10, 10);
const planeMaterial = new THREE.ShaderMaterial({
    vertexShader: planeVertexShader,    
    fragmentShader: planeFragmentShader,
    // attributes: vertex specific

    // uniforms: global (set for all vertexes / fragments)
    uniforms: {
        uTime: {value: 0.0},
        uRadius: {value: 0.5}
        // TODO: add variable and shader logic to switch between shader types
    },
    //wireframe: true

    // varying: sends info between vertex and fragment shader
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.position.set(-3, 0, 0);
scene.add(plane);
gui.add(planeMaterial.uniforms.uRadius, "value").min(0).max(1).name("uRadius");

// sphere
const sphereGeometry = new THREE.SphereGeometry(1);
const sphereMaterial = new THREE.ShaderMaterial({
    vertexShader: sphereVertexShader,    
    fragmentShader: sphereFragmentShader,
    // attributes: vertex specific

    // uniforms: global (set for all vertexes / fragments)
    uniforms: {
        uTime: {value: 0.0},
        uRadius: {value: 0.5}
    },
    //wireframe: true
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.set(0, -3, 0);
scene.add(sphere);
gui.add(sphereMaterial.uniforms.uRadius, "value").min(0).max(1).name("uRadius");

// cube
const cubeGeometry = new THREE.BoxGeometry( 1, 1, 1 );
console.log(cubeGeometry.attributes);
const cubeMaterial = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( cubeGeometry, cubeMaterial );
scene.add( cube );

// icosahedron
const icoGeometry = new THREE.IcosahedronGeometry(1, 1);
const icoMaterial = new THREE.ShaderMaterial({
    vertexShader: icoVertexShader,    
    fragmentShader: icoFragmentShader,
    // attributes: vertex specific

    // uniforms: global (set for all vertexes / fragments)
    uniforms: {
        uTime: {value: 0.0},
    }

    // varying: sends info between vertex and fragment shader
});

const ico = new THREE.Mesh(icoGeometry, icoMaterial)
ico.position.set(3, 0, 0);
scene.add(ico);

function animate() {
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  renderer.render( scene, camera );

  stats.update();
}