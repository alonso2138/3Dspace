// SceneSetup.js
import Experience from './Main.js'
import { gsap } from 'gsap';
//import { OrbitControls } from "https://unpkg.com/three@0.112/examples/jsm/controls/OrbitControls.js";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import MobilePov from './interface/MobilePov.js';

export default class SceneSetup {
    constructor(canvas) {

        this.experience = new Experience();
        this.mobilePov = new MobilePov();
        this.scene = new THREE.Scene();

        //Ressources
        this.resources = this.experience.resources

        // Canvas
        this.canvas = canvas

        // Original camera pos
        this.cameraOriginal = [0, 2.4, 0.1]
        this.targetOriginal = [0, 2.3, 0]

        this.setupCamera();
        this.setupRenderer();
        this.addLights();
    }

    setupCamera() {
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 500);
        this.camera.position.set(this.cameraOriginal[0], this.cameraOriginal[1], this.cameraOriginal[2]); // Posición de la cámara para ver el objeto

        // this.Controls for rotating the scene
        this.controls = new OrbitControls(this.camera, this.canvas);
        this.controls.enablePan = true; // Disable panning
        this.controls.target.set(this.targetOriginal[0], this.targetOriginal[1], this.targetOriginal[2]);
        this.controls.minDistance = 1.5;
        this.controls.maxDistance = 4;
        this.controls.enableDamping = true;
    }

    setupRenderer() {     
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true
        })

        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0xffffff); // Fondo blanco
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        this.renderer.toneMapping = THREE.LinearToneMapping
        this.renderer.toneMappingExposure = 0.5;
        
        document.body.appendChild(this.renderer.domElement);

    }

    moveCamera(cam,target){
        if(cam){
            // Pos as vector3
            gsap.to(this.camera.position, {
                x: cam[0],
                y: cam[1],
                z: cam[2],
                duration: 1 // Adjust the duration as needed
            });
        }
        if(target){
            // Pos as vector3
            gsap.to(this.controls.target, {
                x: target[0],
                y: target[1],
                z: target[2],
                duration: 1 // Adjust the duration as needed
            });
        }
    }

    resetCamera(){
        // Pos as vector3
        gsap.to(this.camera.position, {
            x: 0,
            y: 2.6,
            z: 0.1,
            duration: 1 // Adjust the duration as needed
        });

        // Pos as vector3
        gsap.to(this.controls.target, {
            x: 0,
            y: 2.5,
            z: 0,
            duration: 1 // Adjust the duration as needed
        });
    }
    
    addLights() {
        // Ambient Light
        const ambientLight = new THREE.AmbientLight('#ffffff', 2);
        this.scene.add(ambientLight);

        // Additional Lights
        this.pointLight1 = new THREE.PointLight('#ffffff', 0.8, 50);
        this.pointLight1.position.set(0, 0, 0);
        this.scene.add(this.pointLight1);


        // Environment map
        const environmentMap = this.resources.items.environmentMapTexture;
        environmentMap.colorSpace = THREE.SRGBColorSpace;
        environmentMap.encoding = THREE.sRGBEncoding;

        
        this.scene.environment = environmentMap;
        if(this.experience.moto.sky!="") this.scene.background = environmentMap;
    }
    resize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.renderer.setPixelRatio(Math.max(window.devicePixelRatio, 2))

        if(window.innerWidth<768){
            this.mobilePov.startMobilePov();
        }else {
            this.mobilePov.endMobilePov();
        }
    }

    render() {
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
}