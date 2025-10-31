import * as THREE from 'three';
import GUI from 'lil-gui'; 
import Stats from 'three/addons/libs/stats.module.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'

import planeVertexShader from './shaders/plane/vertex.glsl?raw';
import planeFragmentShader from './shaders/plane/fragment.glsl?raw';

// used with shader material
import organicVertexShader from './shaders/organic/vertex.glsl?raw';
import organicFragmentShader from './shaders/organic/fragment.glsl?raw';

// used with standard material
import organicVertexPars from './shaders/organic/vertex_pars.glsl?raw'
import organicVertexMain from './shaders/organic/vertex_main.glsl?raw'
import organicFragmentPars from './shaders/organic/fragment_pars.glsl?raw'
import organicFragmentMain from './shaders/organic/fragment_main.glsl?raw'

import icoVertexShader from './shaders/icosahedron/vertex.glsl?raw';
import icoFragmentShader from './shaders/icosahedron/fragment.glsl?raw';

import sphereVertexShader from './shaders/sphere/vertex.glsl?raw';
import sphereFragmentShader from './shaders/sphere/fragment.glsl?raw';

import puppyTexture from './images/puppy.jpg'

// https://threejs.org/manual/#en/installation

// tutorial from here: https://youtu.be/oKbCaj1J6EI?si=LQo_a9qhDb_ztYgn

const clock = new THREE.Clock();
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
//const dirLight = new THREE.DirectionalLight('#ffffff', 0.75)
//dirLight.position.set(5, 5, 5)

//const ambientLight = new THREE.AmbientLight('#ffffff', 0.2)
//scene.add(dirLight, ambientLight)

// lighting
const dirLight = new THREE.DirectionalLight('#526cff', 0.6)
dirLight.position.set(2, 2, 2)

const ambientLight = new THREE.AmbientLight('#4255ff', 0.5)
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
        uRadius: {value: 0.5},
        uTexture: {value: new THREE.TextureLoader().load(puppyTexture)}
        // TODO: add variable and shader logic to switch between shader types
    },
    //wireframe: true

    // varying: sends info between vertex and fragment shader
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.position.set(-3, 0, 0);
scene.add(plane);
gui.add(planeMaterial.uniforms.uRadius, "value").min(0).max(1).name("uRadius");

// organic plane
const organicGeometry = new THREE.IcosahedronGeometry(1, 400);

/*
const organicShaderMaterial = new THREE.ShaderMaterial({
    vertexShader: organicVertexShader,    
    fragmentShader: organicFragmentShader,
    uniforms: {
        uTime: {value: 0.0},
    },
});
const organicMesh = new THREE.Mesh(organicGeometry, organicShaderMaterial);
*/

const organicStandardMaterial = new THREE.MeshStandardMaterial( {
    onBeforeCompile: (shader) => {
        // storing reference to shader object
        organicStandardMaterial.userData.shader = shader;

        shader.uniforms.uTime = {value: 0.0};

        const parsVertexString = `#include <displacementmap_pars_vertex>`;
        shader.vertexShader = shader.vertexShader.replace(
            parsVertexString,
            parsVertexString + organicVertexPars
        );
        
        const mainVertexString = `#include <displacementmap_vertex>`; 
        shader.vertexShader = shader.vertexShader.replace(
            mainVertexString,
            mainVertexString + organicVertexMain
        );
        //console.log(shader.vertexShader);        

        const parsFragmentString = `#include <bumpmap_pars_fragment>`;
        shader.fragmentShader = shader.fragmentShader.replace(
            parsFragmentString,
            parsFragmentString + organicFragmentPars
        )

        const mainFragmentString = `#include <normal_fragment_maps>`;
        shader.fragmentShader = shader.fragmentShader.replace(
            mainFragmentString,
            mainFragmentString + organicFragmentMain
        )
        //console.log(shader.fragmentShader);
    }
})
const organicMesh = new THREE.Mesh(organicGeometry, organicStandardMaterial);

organicMesh.position.set(0, 3, 0);
scene.add(organicMesh);

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

// post-processing
const composer = new EffectComposer(renderer);
composer.addPass(new UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), 0.7, 0.4, 0.4));

function animate() {

    if(!clock)
        return;

    const time = clock.getElapsedTime() * 2;
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    renderer.render( scene, camera );
    if(typeof organicShaderMaterial !== "undefined")
        organicShaderMaterial.uniforms.uTime.value = time;
    if(typeof organicStandardMaterial !== "undefined")
        organicStandardMaterial.userData.shader.uniforms.uTime.value = time;
    stats.update();
}