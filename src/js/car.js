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
                "RB",
                { x: -0.5, y: 0, z: 0.5 },
                { x: 0, y: 3.14159, z: 0 },
            ], //Right Back
            // [
            //     "LB",
            //     { x: -1.1, y: 0, z: 0 },
            //     { x: 0, y: 0, z: 0 },
            // ], //Left Back
            // [
            //     "RF",
            //     { x: 1.2, y: 0, z: 1 },
            //     { x: 0, y: 3.14159, z: 0 },
            // ], //Right Front
            // [
            //     "LF",
            //     { x: -0.1, y: 0, z: 0 },
            //     { x: 0, y: 0, z: 0 },
            // ], //Left Front
        ]

        wheelPositions.forEach((posrot) => {
            const side = posrot[0]
            const position = posrot[1]
            const rotation = posrot[2]
            
            const wheelMesh = this.wheel.model.clone()
            
            wheelMesh.position.copy(position)
            wheelMesh.rotation.set(rotation.x, rotation.y, rotation.z)
            
            this.wheel[side] = wheelMesh
        })
    }
}
