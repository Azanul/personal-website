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

        this.groundMaterial = new CANNON.Material("ground")
        this.wheelMaterial = new CANNON.Material("wheel")

        this.engineForce = 0
        this.steeringValue = 0
        this.brakeForce = 0

        this.setWorld()
        this.setEarth()
        this.setCar()
        this.setControls()
    }

    setWorld() {
        this.world.gravity.set(0, 0, 0)
        this.world.defaultContactMaterial.friction = 0
        this.world.broadphase = new CANNON.SAPBroadphase(this.world)

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

        this.world.addEventListener("postStep", () => {
            this.world.bodies.forEach((b) => {
                if (b == this.earth.body) {
                    return
                }
                const force = new CANNON.Vec3()
                force
                    .set(
                        this.earth.body.position.x - b.position.x,
                        this.earth.body.position.y - b.position.y,
                        this.earth.body.position.z - b.position.z
                    )
                    .normalize()
                force.scale(50, b.force)
                b.applyLocalForce(force, b.position)
            })
        })
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
        this.car.maxEngineForce = 20
        this.car.maxSteeringValue = 0.5
        this.car.maxBrakeForce = 30

        let box = new THREE.Box3().setFromObject(this.car.chassis.model)
        let size = box.getSize(new THREE.Vector3())
        this.car.chassis.shape = new CANNON.Box(
            new CANNON.Vec3(size.x * 0.5, size.y * 0.2, size.z * 0.35)
        )

        this.car.chassis.body = new CANNON.Body({
            mass: 20,
            shape: this.car.chassis.shape,
            position: new CANNON.Vec3(0, 30, 0),
            linearDamping: 0.5,
            angularDamping: 0.5,
        })

        this.container.add(this.car.container)

        box = new THREE.Box3().setFromObject(this.car.wheel.model)
        size = box.getSize(new THREE.Vector3())

        this.car.vehicle = new CANNON.RaycastVehicle({
            chassisBody: this.car.chassis.body,
            indexRightAxis: 2,
            indexForwardAxis: 0,
            indexUpAxis: 1,
        })

        this.car.wheels = {}
        this.car.wheels.options = {
            radius: size.x * 0.5,
            height: size.z * 0.5,
            suspensionStiffness: 30,
            suspensionRestLength: 0.5,
            maxSuspensionForce: 100000,
            maxSuspensionTravel: 0.3,
            frictionSlip: 1.4,
            dampingRelaxation: 2.3,
            dampingCompression: 4.4,
            rollInfluence: 0.01,
            directionLocal: new CANNON.Vec3(0, -1, 0),
            axleLocal: new CANNON.Vec3(0, 0, 1),
            chassisConnectionPointLocal: new CANNON.Vec3(),
            customSlidingRotationalSpeed: -30,
            useCustomSlidingRotationalSpeed: true,
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
            const wheelShape = new CANNON.Cylinder(
                wheel.radius,
                wheel.radius,
                wheel.radius * 0.5,
                20
            )

            const wheelBody = new CANNON.Body({
                mass: 0,
                material: this.wheelMaterial,
                type: CANNON.Body.KINEMATIC,
                collisionFilterGroup: 0,
            })
            const quaternion = new CANNON.Quaternion().setFromEuler(0, 0, 0)
            wheelBody.addShape(wheelShape, new CANNON.Vec3(), quaternion)
            this.car.wheel.body.push(wheelBody)

            this.world.addBody(wheelBody)
            this.container.add(this.car.wheel.visuals[i])
        })

        this.world.addEventListener("postStep", () => {
            for (let i = 0; i < this.car.vehicle.wheelInfos.length; i++) {
                this.car.vehicle.updateWheelTransform(i)
                const t = this.car.vehicle.wheelInfos[i].worldTransform

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

        this.car.container.position.copy(this.car.chassis.body.position)
        this.car.container.quaternion.copy(this.car.chassis.body.quaternion)
    }

    setControls() {
        this.keyboard = {}
        this.keyboard.events = {}

        this.keyboard.events.keyDown = (_event) => {
            switch (_event.code) {
                case "ArrowUp":
                case "KeyW":
                    this.engineForce = Math.min(
                        this.engineForce + 5,
                        this.car.maxEngineForce
                    )
                    this.car.vehicle.applyEngineForce(this.engineForce, 1)
                    this.car.vehicle.applyEngineForce(this.engineForce, 3)
                    break

                case "ArrowRight":
                case "KeyD":
                    this.steeringValue = Math.max(
                        this.steeringValue - 0.05,
                        -this.car.maxSteeringValue
                    )
                    this.car.vehicle.setSteeringValue(this.steeringValue, 0)
                    this.car.vehicle.setSteeringValue(this.steeringValue, 2)
                    break

                case "ArrowDown":
                case "KeyS":
                    this.engineForce = Math.max(
                        this.engineForce - 5,
                        -this.car.maxEngineForce
                    )
                    this.car.vehicle.applyEngineForce(this.engineForce, 1)
                    this.car.vehicle.applyEngineForce(this.engineForce, 3)
                    break

                case "ArrowLeft":
                case "KeyA":
                    this.steeringValue = Math.min(
                        this.steeringValue + 0.05,
                        this.car.maxSteeringValue
                    )
                    this.car.vehicle.setSteeringValue(this.steeringValue, 0)
                    this.car.vehicle.setSteeringValue(this.steeringValue, 2)
                    break

                case "ControlLeft":
                case "ControlRight":
                case "Space":
                    this.brakeForce = Math.min(
                        this.brakeForce + 0.01,
                        this.car.maxBrakeForce
                    )
                    this.car.vehicle.setBrake(this.brakeForce, 0)
                    this.car.vehicle.setBrake(this.brakeForce, 1)
                    this.car.vehicle.setBrake(this.brakeForce, 2)
                    this.car.vehicle.setBrake(this.brakeForce, 3)
                    break

                case "ShiftLeft":
                case "ShiftRight":
                    break
            }
        }

        this.keyboard.events.keyUp = (_event) => {
            switch (_event.code) {
                case "ArrowUp":
                case "KeyW":
                    this.car.vehicle.applyEngineForce(0, 1)
                    this.car.vehicle.applyEngineForce(0, 3)
                    break

                case "ArrowRight":
                case "KeyD":
                    break

                case "ArrowDown":
                case "KeyS":
                    this.car.vehicle.applyEngineForce(0, 1)
                    this.car.vehicle.applyEngineForce(0, 3)
                    break

                case "ArrowLeft":
                case "KeyA":
                    break

                case "ControlLeft":
                case "ControlRight":
                case "Space":
                    this.car.vehicle.setBrake(0, 0)
                    this.car.vehicle.setBrake(0, 1)
                    this.car.vehicle.setBrake(0, 2)
                    this.car.vehicle.setBrake(0, 3)
                    break

                case "ShiftLeft":
                case "ShiftRight":
                    break

                case "KeyR":
                    this.trigger("action", ["reset"])
                    break
            }
        }
        
        document.addEventListener("keydown", this.keyboard.events.keyDown)
        document.addEventListener("keyup", this.keyboard.events.keyUp)
    }
}
