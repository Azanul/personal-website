import * as THREE from "three"

import { TrackballControls } from "three/addons/controls/TrackballControls.js"
import CannonDebugger from "cannon-es-debugger"

import Resources from "./js/resources"
import Car from "./js/car"
import Earth from "./js/earth"
import Physics from "./js/physics"

function clamp(value, min, max) {
    console.log(min, value, max)
    return Math.max(min, Math.min(max, value));
}

const xMin = 10;
const xMax = 150;
const yMin = 10;
const yMax = 150;
const zMin = 10;
const zMax = 150;

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(
    24,
    window.innerWidth / window.innerHeight,
    5,
    2000
)

scene.background = new THREE.Color(0x87ceeb)
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const cameraControls = new TrackballControls(camera, renderer.domElement)

const light = new THREE.AmbientLight(0x404040, 10)
scene.add(light)

const sun = new THREE.DirectionalLight(0x404040, 30)
scene.add(sun)

camera.position.set(100, 100, 100)

const resources = new Resources()

var car

THREE.DefaultLoadingManager.onLoad = function () {
    console.log("Loading Complete!")

    let earth = new Earth()
    sun.target = earth.container

    car = new Car({ camera: camera, renderer: renderer, resources: resources })

    let physics = new Physics({ car, earth })
    scene.add(physics.container)

    var cannonDebugRenderer = new CannonDebugger(scene, physics.world)

    const desiredPosition = new THREE.Vector3()

    function animate() {
        requestAnimationFrame(animate)

        physics.update()

        desiredPosition.set(
            clamp(camera.position.x, car.container.position.x+xMin, car.container.position.x+xMax),
            clamp(camera.position.y, car.container.position.x+yMin, car.container.position.x+yMax),
            clamp(camera.position.z, car.container.position.x+zMin, car.container.position.x+zMax)
        )
        console.log(camera.position, desiredPosition)

        camera.position.lerp(desiredPosition, 0.1)

        camera.lookAt(car.container.position)
        cameraControls.target.copy(car.container.position)

        const carUp = new THREE.Vector3(0, 1, 0)
        carUp.applyQuaternion(car.container.quaternion)
        camera.up.copy(carUp)

        cameraControls.update()

        cannonDebugRenderer.update()
        renderer.render(scene, camera)
    }

    animate()
}
