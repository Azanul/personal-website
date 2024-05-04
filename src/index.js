import * as THREE from 'three';

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

import CarChassis from './models/car/chassis.glb';
import CarWheel from './models/car/wheel.glb';

import Car from './js/car';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const loader = new GLTFLoader();

var car;

var chassis;
loader.load( CarChassis, function ( gltf ) {
	chassis = gltf.scene;
	if (wheel !== undefined) {
		car = new Car({chassis: chassis, wheel: wheel});
		scene.add( car.container );
	}
}, undefined, function ( error ) {
	console.error( error );
} );

var wheel;
loader.load( CarWheel, function ( gltf ) {
	wheel = gltf.scene;
	if (chassis !== undefined) {
		car = new Car({chassis: chassis, wheel: wheel});
		scene.add( car.container );
	}
}, undefined, function ( error ) {
	console.error( error );
} );

scene.background = new THREE.Color( 0xfaa9a9 );
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const light = new THREE.AmbientLight( 0x404040, 50 );
scene.add( light );

camera.position.z = 5;

function animate() {
	requestAnimationFrame( animate );

	if (car !== undefined) {
		car.container.rotation.x += 0.01;
		car.container.rotation.y += 0.01;
	}

	renderer.render( scene, camera );
}

animate();
