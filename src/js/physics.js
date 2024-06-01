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
        this.world.defaultContactMaterial.friction = 1
        this.world.defaultContactMaterial.restitution = 0
    }

    setEarth() {
        this.earth.shape = new CANNON.Sphere(30)
        this.earth.body = new CANNON.Body({
            type: CANNON.Body.STATIC,
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

        this.container.add(this.car.container)

        box = new THREE.Box3().setFromObject(this.car.wheel.model)
        size = box.getSize(new THREE.Vector3())
        let wheelShape = new CANNON.Cylinder(
            size.x * 0.5,
            size.y * 0.5,
            size.z * 0.5,
            20
        )

        this.car.vehicle = new CANNON.RaycastVehicle({
            chassisBody: this.car.chassis.body,
            indexRightAxis: 2,
            indexUpAxis: 0,
            indexForwardAxis: 1,
        })

        this.car.wheels = {}
        this.car.wheels.options = {
            radius: size.x * 0.5,
            height: size.z * 0.5,
            suspensionStiffness: 20,
			suspensionRestLength: 0.2,
			maxSuspensionTravel: 1,
			frictionSlip: 0.8,
			dampingRelaxation: 2,
			dampingCompression: 2,
			rollInfluence: 0.8,
            directionLocal: new CANNON.Vec3(0, -1, 0),
            axleLocal: new CANNON.Vec3(-1, 0, 0),
            chassisConnectionPointLocal: new CANNON.Vec3(),
        }

        // Front left
        this.car.wheels.options.chassisConnectionPointLocal.set(1, 0, -1)
        this.car.vehicle.addWheel(this.car.wheels.options)

        // Front right
        this.car.wheels.options.chassisConnectionPointLocal.set(-1, 0, -1)
        this.car.vehicle.addWheel(this.car.wheels.options)

        // Back left
        this.car.wheels.options.chassisConnectionPointLocal.set(1, 0, 1)
        this.car.vehicle.addWheel(this.car.wheels.options)

        // Back right
        this.car.wheels.options.chassisConnectionPointLocal.set(-1, 0, 1)
        this.car.vehicle.addWheel(this.car.wheels.options)

        this.car.vehicle.addToWorld(this.world)

        for (const key in this.car.wheel) {
            if (key !== "model") {
                this.car.wheel[key].body = new CANNON.Body({
                    mass: 5,
                    shape: wheelShape,
                    position: this.car.wheel[key].position,
                })

                this.container.add(this.car.wheel[key])
            }
        }
    }

    update() {
        const elapsedTime = this.clock.getElapsedTime()
        this.world.step(1 / 60, elapsedTime - this.oldElapsedTime, 3)
        this.oldElapsedTime = elapsedTime

        if (this.controls.actions.up) {
            this.car.vehicle.applyEngineForce(50, 0)
            this.car.vehicle.applyEngineForce(50, 1)
            this.car.vehicle.applyEngineForce(50, 2)
            this.car.vehicle.applyEngineForce(50, 3)
        }

        if (this.controls.actions.down) {
            this.car.vehicle.applyEngineForce(-50, 0)
            this.car.vehicle.applyEngineForce(-50, 1)
            this.car.vehicle.applyEngineForce(-50, 2)
            this.car.vehicle.applyEngineForce(-50, 3)
        }

        this.car.container.position.copy(this.car.chassis.body.position)
        this.car.container.quaternion.set(
            this.car.chassis.body.quaternion.x,
            this.car.chassis.body.quaternion.y,
            this.car.chassis.body.quaternion.z,
            this.car.chassis.body.quaternion.w
        )

        var i = 0
        for (const key in this.car.wheel) {
            if (key !== "model") {
                this.car.vehicle.updateWheelTransform(i)
                var t = this.car.vehicle.wheelInfos[i].worldTransform

                this.car.wheel[key].body.position.copy(t.position)
                this.car.wheel[key].body.quaternion.copy(t.quaternion)

                this.car.wheel[key].position.copy(t.position)
                this.car.wheel[key].quaternion.copy(t.quaternion)

                i++
            }
        }

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
