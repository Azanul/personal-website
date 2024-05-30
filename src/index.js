import * as THREE from "three"

import { TrackballControls } from "three/addons/controls/TrackballControls.js"
import CannonDebugger from 'cannon-es-debugger'

import Resources from "./js/resources"
import Car from "./js/car"
import Earth from "./js/earth"
import Physics from "./js/physics"
import Controls from "./js/controls"

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
)

scene.background = new THREE.Color(0x87ceeb)
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const cameraControls = new TrackballControls(camera, renderer.domElement)
cameraControls.target.set(0, 0, 0)

const light = new THREE.AmbientLight(0x404040, 10)
scene.add(light)

const sun = new THREE.DirectionalLight(0x404040, 30)
scene.add(sun)

camera.position.set(5, 45, 45)

const resources = new Resources()

var car

THREE.DefaultLoadingManager.onLoad = function () {
    console.log("Loading Complete!")

    let earth = new Earth()
    sun.target = earth.container

    car = new Car({ camera: camera, renderer: renderer, resources: resources })
    car.container.position.setY(16)

	let controls = new Controls({camera: camera})

    let physics = new Physics({ car, earth, controls })
    scene.add(physics.container)

	var cannonDebugRenderer = new CannonDebugger( scene, physics.world );

    function animate() {
        requestAnimationFrame(animate)

        physics.update()
        // camera.position.y = car.container.y - 10

        camera.lookAt(car.container.position)
        cameraControls.update()

		cannonDebugRenderer.update()
        renderer.render(scene, camera)
    }

    animate()
}
