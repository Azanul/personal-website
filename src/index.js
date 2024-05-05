import * as THREE from "three";

import Resources from "./js/resources";
import Car from "./js/car";
import Floor from "./js/floor";

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

const light = new THREE.AmbientLight(0x404040, 10);
scene.add(light);

const sun = new THREE.DirectionalLight(0x404040, 30);
scene.add(sun);

camera.position.z = 50;

const resources = new Resources();

var car;

function animate() {
    requestAnimationFrame(animate);

    renderer.render(scene, camera);
}

THREE.DefaultLoadingManager.onLoad = function () {
    console.log("Loading Complete!");

	let floor = new Floor();
    scene.add(floor.container);
	
    car = new Car({ resources: resources });
	car.container.position.setY(16);
    scene.add(car.container);

    animate();
};
