// SceneSetup.js
import Experience from './Main.js'

export default class SceneSetup {
    constructor(canvas) {

        this.experience = new Experience();
        this.scene = new THREE.Scene();

        //Ressources
        this.resources = this.experience.resources

        // Canvas
        this.canvas = canvas

        this.setupCamera();
        this.setupRenderer();
        this.addLights();
    }

    setupCamera() {
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(-1, 1, 1); // Posición de la cámara para ver el objeto

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
    }

    resize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    }

    render() {
        this.renderer.render(this.scene, this.camera);
        if(this.pointLight1) this.pointLight1.position.copy(this.camera.position);
    }
}