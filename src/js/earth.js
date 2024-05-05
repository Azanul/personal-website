import * as THREE from "three"

export default class Earth {
    constructor() {
        // Container
        this.container = new THREE.Object3D()

        // Geometry
        const geometry = new THREE.SphereGeometry(30, 8, 8)
        const material = new THREE.ShaderMaterial({
            uniforms: {
                color1: {
                    value: new THREE.Color("yellow"),
                },
                color2: {
                    value: new THREE.Color("orange"),
                },
            },
            vertexShader: `
              varying vec2 vUv;
          
              void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
              }
            `,
            fragmentShader: `
              uniform vec3 color1;
              uniform vec3 color2;
            
              varying vec2 vUv;
              
              void main() {
                gl_FragColor = vec4(mix(color1, color2, vUv.y), 1.0);
              }
            `,
        })
        const sphere = new THREE.Mesh(geometry, material)

        this.container.add(sphere)
    }
}
