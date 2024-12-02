// SceneSetup.js
import Experience from './Main.js'
import { gsap } from 'gsap';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import MobilePov from './interface/MobilePov.js';
import InteractionDetector from './interface/InteractionDetector.js';

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
        this.cameraOriginal = this.experience.moto.povs[0];
        this.targetOriginal = this.experience.moto.lookAt[0];

        // Usage
        this.interactionDetector = new InteractionDetector();

        this.setupCamera();
        this.setupRenderer();
        this.addLights();
    }

    setupCamera() {
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 500);
        this.camera.position.set(this.cameraOriginal[0], this.cameraOriginal[1], this.cameraOriginal[2]); // Posición de la cámara para ver el objeto

        // this.Controls for rotating the scene
        this.controls = new OrbitControls(this.camera, this.canvas);
        this.controls.enablePan = true; // Disable panning
        this.controls.target.set(this.targetOriginal[0], this.targetOriginal[1], this.targetOriginal[2]);
        this.controls.dampingFactor = 0.01; // friction
        this.controls.rotateSpeed = 0.2; // mouse sensitivity
        this.controls.enableDamping = true;

        this.controls.minDistance = 4;
        this.controls.maxDistance = 16;

        this.controls.maxAzimuthAngle = 0.65;
        this.controls.minAzimuthAngle = -0.55;
        
        this.controls.maxPolarAngle = 1.7;
        this.controls.minPolarAngle = 1.14;
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
        this.renderer.toneMappingExposure = 0.1;
        
        document.body.appendChild(this.renderer.domElement);

    }

    animateExposure(){
        setTimeout(() => {
            gsap.to(this.renderer, {
                toneMappingExposure: 0.9,
                duration: 3,
                ease: "elastic.inOut" // You can choose any easing function you prefer
            });
        }, 200);

    }

    moveCamera(cam,target){
        console.log(cam,target)
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
        this.moveCamera(this.cameraOriginal,this.targetOriginal);
    }
    
    addLights() {
        // Ambient Light
        const ambientLight = new THREE.AmbientLight('#ffffff', 1);
        this.scene.add(ambientLight);

        //const lights = [[-2.4,3.4,0.2],[3.3,2.8,-0.3],[2,2.9,2.9],[5,2.9,2.8]]
        const lights = []

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


        // Example usage in another part of your code
        if (this.interactionDetector.isTouchInteraction()) {
            console.log('Currently using touch interaction');
            this.customCursor();
        } else {
            console.log('Currently using cursor interaction');
            this.customCursor(1);

        }

        if(window.innerWidth<768){
            
            
            //this.mobilePov.startMobilePov();
        }else {
            //this.mobilePov.startMobilePov();
        }
    }

    customCursor(borrar){
        if(borrar){
            const circleElement = document.getElementById('custom-cursor');
            document.body.style.cursor = 'unset';
            if(circleElement) circleElement.remove();
        }
        if(borrar) return;

        if(document.getElementById('custom-cursor')) return;

        document.body.style.cursor = 'none';

        const circleElement = document.createElement('div');
        circleElement.id = 'custom-cursor';
        circleElement.style=`
                --cursor-size: 40px;
                position: absolute;
                z-index: 1000;
                width: var(--cursor-size);
                height: var(--cursor-size);
                border: 1px solid #fff;
                border-radius: 100%;
                top: calc(-1 * var(--cursor-size) / 2);
                left: calc(-1 * var(--cursor-size) / 2);
                pointer-events: none;
            `;
        document.body.appendChild(circleElement);

            const speed = 0.15;
            const mouse = { x: 0, y: 0 },
                  circle = { x: 0, y: 0 };
            
            window.addEventListener('mousemove', e => {
              circle.x += (e.x - circle.x) * speed;
              circle.y += (e.y - circle.y) * speed;
              circleElement.style.transform = `translate(${circle.x}px, ${circle.y}px)`;
            });
    }

    render() {
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
        //console.log(this.controls.getAzimuthalAngle().toFixed(2),this.controls.getPolarAngle().toFixed(2))
    }
}