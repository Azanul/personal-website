import * as THREE from 'three';

export default class Car {
    constructor(_options) {
        this.container = new THREE.Object3D();
        this.position = new THREE.Vector3();
        this.rotation = new THREE.Vector3();

        this.chassis = _options.chassis;
        this.wheel = _options.wheel;

        this.container.add(this.chassis);
        this.container.add( this.wheel);
    }
}