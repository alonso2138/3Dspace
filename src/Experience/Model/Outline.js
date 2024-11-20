import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js';

export default class Outline {
    constructor(scene, camera, renderer) {
        this.group = new THREE.Group();

        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;

        this.composer = new EffectComposer(renderer);
        this.outlinePass = new OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), scene, camera);

        const renderPass = new RenderPass(scene, camera);

        this.composer.addPass( renderPass);
        this.composer.addPass( this.outlinePass);

        // Set the outline pass properties
        this.outlinePass.visibleEdgeColor.set('#d5a021'); // Orange color
        this.outlinePass.hiddenEdgeColor.set('#d5a021');
        this.outlinePass.edgeStrength = 4.0; // Adjust this value to make the outline thicker
        this.outlinePass.edgeGlow = 1.0; // Adjust this value for the glow effect
        this.outlinePass.edgeThickness = 0.5; // Adjust this value for edge detection thickness
        this.outlinePass.pulsePeriod = 0; // Adjust this value for pulsing effect (0 for no pulse)
    }

    setOutlineVisibility(state, mesh) {
        if (state) {
            this.outlinePass.selectedObjects = [mesh];
        } else {
            this.outlinePass.selectedObjects = [];
        }

    }
}