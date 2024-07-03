import * as THREE from "three"
import { TrackballControls } from "three/addons/controls/TrackballControls.js"

import Resources from "./js/resources"
import Car from "./js/car"
import Earth from "./js/earth"
import Physics from "./js/physics"

// Utility function to clamp a value between a minimum and maximum range
function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value))
}

// Clamping range values
const CLAMP_RANGES = {
    x: { min: 10, max: 150 },
    y: { min: 10, max: 150 },
    z: { min: 10, max: 150 },
}

// Initialize the Three.js scene
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x87ceeb)

// Set up the camera
const camera = new THREE.PerspectiveCamera(
    24,
    window.innerWidth / window.innerHeight,
    5,
    2000
)
camera.position.set(100, 100, 100)

// Set up the renderer
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

// Set up camera controls
const cameraControls = new TrackballControls(camera, renderer.domElement)

// Add lights to the scene
const ambientLight = new THREE.AmbientLight(0x404040, 10)
scene.add(ambientLight)

const sun = new THREE.DirectionalLight(0x404040, 30)
scene.add(sun)

// Resource manager
const resources = new Resources()

let car

// Callback when all resources are loaded
THREE.DefaultLoadingManager.onLoad = function () {
    console.log("Loading Complete!")

    // Initialize Earth and add to the scene
    const earth = new Earth()
    sun.target = earth.container

    // Initialize Car
    car = new Car({ camera, renderer, resources })

    // Initialize Physics and add to the scene
    const physics = new Physics({ car, earth })
    scene.add(physics.container)

    // Desired camera position vector
    const desiredPosition = new THREE.Vector3()

    // Animation loop
    function animate() {
        requestAnimationFrame(animate)

        // Update physics
        physics.update()

        // Clamp camera position around the car
        desiredPosition.set(
            clamp(
                camera.position.x,
                car.container.position.x + CLAMP_RANGES.x.min,
                car.container.position.x + CLAMP_RANGES.x.max
            ),
            clamp(
                camera.position.y,
                car.container.position.x + CLAMP_RANGES.y.min,
                car.container.position.x + CLAMP_RANGES.y.max
            ),
            clamp(
                camera.position.z,
                car.container.position.x + CLAMP_RANGES.z.min,
                car.container.position.x + CLAMP_RANGES.z.max
            )
        )

        // Smooth camera transition
        camera.position.lerp(desiredPosition, 0.1)
        camera.lookAt(car.container.position)
        cameraControls.target.copy(car.container.position)

        // Align camera up vector with the car's up vector
        const carUp = new THREE.Vector3(0, 1, 0)
        carUp.applyQuaternion(car.container.quaternion)
        camera.up.copy(carUp)

        // Update camera controls and render the scene
        cameraControls.update()
        renderer.render(scene, camera)
    }

    // Start the animation loop
    animate()
}
