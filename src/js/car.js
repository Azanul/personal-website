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
        const wheelPositions = ["RB", "LB", "RF", "LF"]

        wheelPositions.forEach((posrot) => {
            const wheelMesh = this.wheel.model.clone()

            this.wheel[posrot] = wheelMesh
            this.container.add(wheelMesh)
        })
    }
}
