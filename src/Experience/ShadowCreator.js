// ShadowCreator.js
// ModelLoader.js
import * as THREE from 'three'


export default class ShadowCreator {
    constructor(scene) {
        this.scene = scene;
    }

    createShadow() {
        const shadowTextureUrl = 'images/sombra.png';

        const shadowTexture = new THREE.TextureLoader();
        const shadowMaterial = new THREE.MeshBasicMaterial({
            map: shadowTexture.load(shadowTextureUrl),
            transparent: true
        });

        const shadowGeometry = new THREE.PlaneGeometry(3, 3); // Tamaño del plano de la sombra
        const shadowPlane = new THREE.Mesh(shadowGeometry, shadowMaterial);
        shadowPlane.rotation.x = -Math.PI / 2; // Rotar el plano para que esté horizontal
        shadowPlane.position.y = 0.01; // Ajustar ligeramente la altura para evitar conflictos con el modelo
        this.scene.add(shadowPlane);
    }
}