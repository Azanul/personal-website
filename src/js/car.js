import * as THREE from "three"

export default class Car {
    constructor(_options) {
        this.camera = _options.camera
        this.renderer = _options.renderer

        this.engineForce = 1000
        this.streeringValue = 90

        this.container = new THREE.Object3D()

        this.chassis = { model: _options.resources.items.carChassis }
        this.wheel = { model: _options.resources.items.carWheel }

        this.container.add(this.chassis.model)

        this.setWheels()
    }

    setWheels() {
        this.wheel.visuals = []
        for(var i = 0; i < 4; i++) {
            const wheelMesh = this.wheel.model.clone()
            
            this.wheel.visuals.push(wheelMesh)
            this.container.add(wheelMesh)
        }
    }
}
