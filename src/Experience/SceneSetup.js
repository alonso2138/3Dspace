// SceneSetup.js
import Experience from './Main.js'
import { gsap } from 'gsap';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import MobilePov from './interface/MobilePov.js';
import { Euler } from 'three';

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
        this.cameraOriginal = [3, 11, 0]
        this.targetOriginal = [3, 1, 0]

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
        this.controls.minDistance = 0;
        this.controls.maxDistance = 40;
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

        this.renderer.toneMapping = THREE.LinearToneMapping;
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

        // If the camera vector is not defined, to avoid bugs, the target distance to the camera should be forced to 1.5 units
        if(!cam){
            const targetVector = new THREE.Vector3(target[0], target[1], target[2]);
            const direction = new THREE.Vector3().subVectors(this.camera.position, targetVector).normalize();
            const newPosition = new THREE.Vector3().addVectors(targetVector, direction.multiplyScalar(1.5));
    
            gsap.to(this.camera.position, {
                x: newPosition.x,
                y: newPosition.y,
                z: newPosition.z,
                duration: 1 // Adjust the duration as needed
            });
        }
    }

    resetCamera(){
        // Pos as vector3
        gsap.to(this.camera.position, {
            x: 3.8,
            y: 1.3,
            z: 1.4,
            duration: 1 // Adjust the duration as needed
        });

        // Pos as vector3
        gsap.to(this.controls.target, {
            x: 3.4,
            y: 1.2,
            z: 0,
            duration: 1 // Adjust the duration as needed
        });
    }
    
    addLights() {
        // Ambient Light
        const ambientLight = new THREE.AmbientLight('#ffffff', 1);
        this.scene.add(ambientLight);

        const lights = [[-2.4,3.4,0.2],[3.3,2.8,-0.3],[2,2.9,2.9],[5,2.9,2.8]]

        lights.forEach(lightPosition => {
            const pointLight = new THREE.PointLight('#ffffff', 1, 10);
            pointLight.position.set(lightPosition[0], lightPosition[1], lightPosition[2]);
            this.scene.add(pointLight);
        });

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
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

        if(window.innerWidth<768){
            this.mobilePov.startMobilePov();
        }else {
            this.mobilePov.startMobilePov();

//            this.mobilePov.endMobilePov();
        }
    }

    render() {
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
}