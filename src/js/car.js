import * as THREE from 'three';
import { TransformControls } from 'three/addons/controls/TransformControls.js';

export default class Car {
    constructor(_options) {
        this.camera = _options.camera
        this.renderer = _options.renderer

        this.container = new THREE.Object3D();

        this.chassis = _options.resources.items.carChassis;
        this.wheel = _options.resources.items.carWheel;

        this.container.add( this.chassis );
        this.container.add( this.wheel );
    }
}