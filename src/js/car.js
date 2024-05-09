import * as THREE from "three"

export default class Car {
    constructor(_options) {
        this.camera = _options.camera
        this.renderer = _options.renderer

        this.container = new THREE.Object3D()

        this.chassis = { model: _options.resources.items.carChassis }
        this.wheel = { model: _options.resources.items.carWheel }

        this.container.add(this.chassis.model)

        this.setWheels()
    }

    setWheels() {
        const wheelPositions = [
            [
                { x: 0.2, y: 0, z: 0 },
                { x: 0, y: 3.14159, z: 0 },
            ], //Right Back
            [
                { x: -1.1, y: 0, z: 0 },
                { x: 0, y: 0, z: 0 },
            ], //Left Back
            [
                { x: 1.2, y: 0, z: 0 },
                { x: 0, y: 3.14159, z: 0 },
            ], //Right Front
            [
                { x: -0.1, y: 0, z: 0 },
                { x: 0, y: 0, z: 0 },
            ], //Left Front
        ]

        wheelPositions.forEach((posrot) => {
            const position = posrot[0]
            const rotation = posrot[1]
            const wheelMesh = this.wheel.model.clone()
            wheelMesh.position.set(position.x, position.y, position.z)
            wheelMesh.rotation.set(rotation.x, rotation.y, rotation.z)
            this.container.add(wheelMesh)
        })
    }
}
