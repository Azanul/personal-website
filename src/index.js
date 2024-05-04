import * as THREE from "three";

import Resources from "./js/resources";
import Car from "./js/car";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

scene.background = new THREE.Color(0xfaa9a9);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const light = new THREE.AmbientLight(0x404040, 50);
scene.add(light);

camera.position.z = 5;

const resources = new Resources();

var car;

function animate() {
    requestAnimationFrame(animate);

    if (car !== undefined) {
        car.container.rotation.x += 0.01;
        car.container.rotation.y += 0.01;
    }

    renderer.render(scene, camera);
}

THREE.DefaultLoadingManager.onLoad = function ( ) {
	console.log( 'Loading Complete!');
	
	car = new Car({ resources: resources });
	scene.add( car.container )

	animate();
};
