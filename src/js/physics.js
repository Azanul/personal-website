import CANNON from "cannon"
import * as THREE from "three"

export default class Physics {
    constructor(_options) {
        this.car = _options.car
        this.earth = _options.earth

        this.container = new THREE.Object3D()

        this.world = new CANNON.World()
        this.clock = new THREE.Clock()
        this.oldElapsedTime = 0

        this.setWorld()
        this.setEarth()
        this.setCar()
    }

    setWorld() {
        this.world.gravity.set(0, 0, 0)
        this.world.allowSleep = true
        this.world.defaultContactMaterial.friction = 0
        this.world.defaultContactMaterial.restitution = 0.2
    }

    setEarth() {
        this.earth.shape = new CANNON.Sphere(30)
        this.earth.body = new CANNON.Body({
            mass: 0,
            shape: this.earth.shape,
            material: new CANNON.ContactMaterial("floorMaterial"),
        })

        this.world.addBody(this.earth.body)
        this.container.add(this.earth.container)
    }

    setCar() {
        this.car.chassis.shape = new CANNON.Box(
            new CANNON.Vec3(this.car.chassis * 0.5, 1 * 0.5, 1 * 0.5)
        )

        this.car.chassis.body = new CANNON.Body({
            mass: 20,
            shape: this.car.chassis.shape,
            position: new CANNON.Vec3(0, 160, 0),
        })

        this.world.addBody(this.car.chassis.body)
        this.container.add(this.car.container)
    }

    update() {
        const elapsedTime = this.clock.getElapsedTime()

        this.world.step(1 / 60, elapsedTime - this.oldElapsedTime, 3)
        this.oldElapsedTime = elapsedTime

        this.car.container.position.x = this.car.chassis.body.position.x
        this.car.container.position.y = this.car.chassis.body.position.y

        this.world.bodies.forEach((b) => {
            const force = new CANNON.Vec3(
                this.earth.body.position.x - b.position.x,
                this.earth.body.position.y - b.position.y,
                this.earth.body.position.z - b.position.z
            )
            b.applyForce(force, b.position)
        })
    }
}
