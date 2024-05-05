import * as THREE from "three"

import Resources from "./js/resources"
import Car from "./js/car"
import Earth from "./js/earth"
import Physics from "./js/physics"

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
)

scene.background = new THREE.Color(0xfaa9a9)
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const light = new THREE.AmbientLight(0x404040, 10)
scene.add(light)

const sun = new THREE.DirectionalLight(0x404040, 30)
scene.add(sun)

camera.position.z = 50

const clock = new THREE.Clock()

const resources = new Resources()

var car

THREE.DefaultLoadingManager.onLoad = function () {
    console.log("Loading Complete!")

    let earth = new Earth()

    car = new Car({ camera: camera, renderer: renderer, resources: resources })
    car.container.position.setY(16)

    let physics = new Physics({ car, earth })
    scene.add(physics.container)

    let oldElapsedTime = 0
    function animate() {
        const elapsedTime = clock.getElapsedTime()

        physics.world.step(1 / 60, elapsedTime - oldElapsedTime, 3)
        oldElapsedTime = elapsedTime

        physics.car.container.position.x = physics.car.chassis.body.position.x
        physics.car.container.position.y = physics.car.chassis.body.position.y

        requestAnimationFrame(animate)

        renderer.render(scene, camera)
    }

    animate()
}
