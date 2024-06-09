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

        this.groundMaterial = new CANNON.Material("ground")
        this.wheelMaterial = new CANNON.Material("wheel")

        this.engineForce = 0
        this.steeringValue = 0

        this.setWorld()
        this.setEarth()
        this.setCar()
        this.setupEventlisteners()
    }

    setWorld() {
        this.world.gravity.set(0, 0, 0)
        this.world.allowSleep = true
        this.world.defaultContactMaterial.friction = 0.4
        this.world.defaultContactMaterial.restitution = 0.5

        const wheel_ground = new CANNON.ContactMaterial(
            this.wheelMaterial,
            this.groundMaterial,
            {
                friction: 0.3,
                restitution: 0,
                contactEquationStiffness: 1000,
            }
        )
        this.world.addContactMaterial(wheel_ground)
    }

    setEarth() {
        this.earth.shape = new CANNON.Sphere(30)
        this.earth.body = new CANNON.Body({
            type: CANNON.Body.STATIC,
            shape: this.earth.shape,
            material: this.groundMaterial,
        })

        this.world.addBody(this.earth.body)
        this.container.add(this.earth.container)
    }

    setCar() {
        let box = new THREE.Box3().setFromObject(this.car.chassis.model)
        let size = box.getSize(new THREE.Vector3())
        this.car.chassis.shape = new CANNON.Box(
            new CANNON.Vec3(size.x * 0.5, size.y * 0.2, size.z * 0.35)
        )

        this.car.chassis.body = new CANNON.Body({
            mass: 20,
            shape: this.car.chassis.shape,
            position: new CANNON.Vec3(0, 30, 0),
        })

        this.container.add(this.car.container)

        box = new THREE.Box3().setFromObject(this.car.wheel.model)
        size = box.getSize(new THREE.Vector3())

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
            suspensionStiffness: 5,
            suspensionRestLength: 0.5,
            maxSuspensionTravel: 0.1,
            frictionSlip: 0,
            dampingRelaxation: 2,
            dampingCompression: 2,
            rollInfluence: 0.01,
            directionLocal: new CANNON.Vec3(0, -1, 0),
            axleLocal: new CANNON.Vec3(0, 0, 1),
            chassisConnectionPointLocal: new CANNON.Vec3(),
        }

        this.car.wheels.options.chassisConnectionPointLocal.set(0.5, 0, -0.5)
        this.car.vehicle.addWheel(this.car.wheels.options)

        this.car.wheels.options.chassisConnectionPointLocal.set(-0.5, 0, -0.5)
        this.car.vehicle.addWheel(this.car.wheels.options)

        this.car.wheels.options.chassisConnectionPointLocal.set(0.5, 0, 0.5)
        this.car.vehicle.addWheel(this.car.wheels.options)

        this.car.wheels.options.chassisConnectionPointLocal.set(-0.5, 0, 0.5)
        this.car.vehicle.addWheel(this.car.wheels.options)

        this.car.vehicle.addToWorld(this.world)

        this.car.wheel.body = []
        this.car.vehicle.wheelInfos.forEach((wheel, i) => {
            let wheelShape = new CANNON.Cylinder(
                wheel.radius,
                wheel.radius,
                wheel.radius * 0.5,
                20
            )

            let wheelBody = new CANNON.Body({
                mass: 0,
                shape: wheelShape,
                material: this.wheelMaterial,
                type: CANNON.Body.KINEMATIC,
            })
            this.car.wheel.body.push(wheelBody)

            this.world.addBody(wheelBody)
            this.container.add(this.car.wheel.visuals[i])
        })
    }

    setupEventlisteners() {
        this.world.addEventListener("postStep", () => {
            for (let i = 0; i < this.car.vehicle.wheelInfos.length; i++) {
                this.car.vehicle.updateWheelTransform(i)
                var t = this.car.vehicle.wheelInfos[i].worldTransform

                this.car.wheel.body[i].position.copy(t.position)
                this.car.wheel.body[i].quaternion.copy(t.quaternion)

                this.car.wheel.visuals[i].position.copy(t.position)
                this.car.wheel.visuals[i].quaternion.copy(t.quaternion)
            }
        })
    }

    update() {
        const elapsedTime = this.clock.getElapsedTime()
        this.world.step(1 / 60, elapsedTime - this.oldElapsedTime, 3)
        this.oldElapsedTime = elapsedTime

        if (this.controls.actions.up) {
            this.engineForce = Math.min(this.engineForce + 5, this.car.maxEngineForce)
            this.car.vehicle.applyEngineForce(this.engineForce, 0)
            this.car.vehicle.applyEngineForce(this.engineForce, 1)
            this.car.vehicle.applyEngineForce(this.engineForce, 2)
            this.car.vehicle.applyEngineForce(this.engineForce, 3)
        }

        if (this.controls.actions.down) {
            this.engineForce = Math.max(this.engineForce - 5, -this.car.maxEngineForce)
            this.car.vehicle.applyEngineForce(this.engineForce, 0)
            this.car.vehicle.applyEngineForce(this.engineForce, 1)
            this.car.vehicle.applyEngineForce(this.engineForce, 2)
            this.car.vehicle.applyEngineForce(this.engineForce, 3)
        }

        if (this.controls.actions.left) {
            this.steeringValue = Math.min(this.steeringValue + 0.05, this.car.maxSteeringValue)
            this.car.vehicle.setSteeringValue(this.steeringValue, 0)
            this.car.vehicle.setSteeringValue(this.steeringValue, 2)
        }

        if (this.controls.actions.right) {
            this.steeringValue = Math.max(this.steeringValue - 0.05, -this.car.maxSteeringValue)
            this.car.vehicle.setSteeringValue(this.steeringValue, 0)
            this.car.vehicle.setSteeringValue(this.steeringValue, 2)
        }

        if (this.controls.actions.brake) {
            this.car.vehicle.setBrake(25, 0)
            this.car.vehicle.setBrake(25, 1)
            this.car.vehicle.setBrake(25, 2)
            this.car.vehicle.setBrake(25, 3)
        }

        this.car.container.position.copy(this.car.chassis.body.position)
        this.car.container.quaternion.copy(this.car.chassis.body.quaternion)

        this.world.bodies.forEach((b) => {
            const force = new CANNON.Vec3()
            force
                .set(
                    this.earth.body.position.x - b.position.x,
                    this.earth.body.position.y - b.position.y,
                    this.earth.body.position.z - b.position.z
                )
                .normalize()

            force.scale(9.8, b.force)
            b.applyLocalForce(force, b.position)
        })
    }
}
