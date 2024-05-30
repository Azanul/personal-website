import CANNON from "cannon"
import * as THREE from "three"

export default class Physics {
    constructor(_options) {
        this.car = _options.car
        this.earth = _options.earth
        this.controls = _options.controls

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
        let box = new THREE.Box3().setFromObject(this.car.chassis.model)
        let size = box.getSize(new THREE.Vector3())
        this.car.chassis.shape = new CANNON.Box(
            new CANNON.Vec3(size.x * 0.5, size.y * 0.5, size.z * 0.5)
        )

        this.car.chassis.body = new CANNON.Body({
            mass: 20,
            shape: this.car.chassis.shape,
            position: new CANNON.Vec3(0, 30, 0),
        })

        this.world.addBody(this.car.chassis.body)
        this.container.add(this.car.container)

        box = new THREE.Box3().setFromObject(this.car.wheel.model)
        size = box.getSize(new THREE.Vector3())
        let wheelShape = new CANNON.Cylinder(
            size.x * 0.5,
            size.y * 0.5,
            size.z * 0.5,
            20
        )
        for (const key in this.car.wheel) {
            if (key !== "model") {
                this.car.wheel[key].body = new CANNON.Body({
                    mass: 5,
                    shape: wheelShape,
                    position: new CANNON.Vec3(0, 100, 0),
                })

                this.world.addBody(this.car.wheel[key].body)
            }
        }
    }

    update() {
        const elapsedTime = this.clock.getElapsedTime()
        this.world.step(1 / 60, elapsedTime - this.oldElapsedTime, 3)
        this.oldElapsedTime = elapsedTime

        if (this.controls.actions.up) {
            console.log("up")
            this.car.wheel.RF.rotateOnAxis(new THREE.Vector3(0, 0, 1), 1)
            this.car.wheel.LF.rotateOnAxis(new THREE.Vector3(0, 0, 1), 1)
        }

        this.car.container.position.copy(this.car.chassis.body.position)
        this.car.container.quaternion.set(
            this.car.chassis.body.quaternion.x,
            this.car.chassis.body.quaternion.y,
            this.car.chassis.body.quaternion.z,
            this.car.chassis.body.quaternion.w
        )

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
