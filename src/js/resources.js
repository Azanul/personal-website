import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

import CarChassis from "../models/car/chassis.glb";
import CarWheel from "../models/car/wheel.glb";

export default class Resources {
    constructor() {
        this.loader = new GLTFLoader();

        this.items = {};
        this.setModels();
    }

    setModels() {
        let self = this;
        [
            { name: "carChassis", source: CarChassis },
            { name: "carWheel", source: CarWheel },
        ].forEach((res) => {
            this.loader.load(
                res.source,
                function (gltf) {
                    self.items[res.name] = gltf.scene;
                },
                undefined,
                function (error) {
                    console.error(error);
                }
            );
        });
    }
}
