import * as THREE from 'three';

export default class Car {
    constructor(_options) {
        this.container = new THREE.Object3D();

        this.chassis = _options.resources.items.carChassis;
        this.wheel = _options.resources.items.carWheel;

        this.container.add( this.chassis );
        this.container.add( this.wheel );
    }
}