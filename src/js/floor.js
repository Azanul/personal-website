import * as THREE from "three";

export default class Floor {
    constructor() {
        // Container
        this.container = new THREE.Object3D();
        this.container.matrixAutoUpdate = false;

        // Geometry
        this.geometry = new THREE.PlaneGeometry(2, 2, 10, 10);

        let material = new THREE.MeshStandardMaterial({
          roughness: 0.8,
          color: new THREE.Color(0x00c500),
        });
        let plane = new THREE.Mesh(this.geometry, material);
        plane.castShadow = false;
        plane.receiveShadow = true;

        this.container.add(plane);
    }
}
