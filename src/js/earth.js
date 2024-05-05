import * as THREE from "three";

export default class Earth {
    constructor() {
        // Container
        this.container = new THREE.Object3D();

        // Geometry
        const geometry = new THREE.SphereGeometry(15, 32, 16);
        const material = new THREE.MeshLambertMaterial({ color: 0xffff00 });
        const sphere = new THREE.Mesh(geometry, material);

        this.container.add(sphere);
    }
}
