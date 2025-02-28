import * as THREE from 'three'
import { ARButton } from 'three/examples/jsm/webxr/ARButton.js'

export default class WebXR
{
    constructor(canvas)
    {
        // Store the canvas element
        this.canvas = canvas
        
        // Initialize properties
        this.scene = null
        this.camera = null
        this.renderer = null
        this.cube = null
        this.reticle = null
        this.hitTestSource = null
        this.hitTestSourceRequested = false
        
        // Check if it's iOS
        this.isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        
        this.init();
    }

    init()
    {
        // Create scene
        this.scene = new THREE.Scene()

        // Create camera
        this.camera = new THREE.PerspectiveCamera(
            70,
            window.innerWidth / window.innerHeight,
            0.01,
            20
        )

        // Add light
        const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
        this.scene.add(light);

        // Create renderer using the canvas from Experience
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: this.canvas, 
            antialias: true, 
            alpha: true 
        })
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        this.renderer.xr.enabled = true

        // Add appropriate AR button based on device
        if (this.isIOS) {
            this.addIOSARButton();
        } else {
            // Add WebXR AR button for supported devices
            try {
                document.body.appendChild(ARButton.createButton(this.renderer, {
                    requiredFeatures: ['hit-test']
                }));
                
                // Create a simple cube for WebXR
                const geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
                const material = new THREE.MeshStandardMaterial({ 
                    color: 0x00ff00,
                    roughness: 0.7,
                    metalness: 0.3
                });
                this.cube = new THREE.Mesh(geometry, material);
                this.cube.visible = false; // Hide initially
                this.scene.add(this.cube);

                // Create reticle for placement indication
                const ringGeo = new THREE.RingGeometry(0.1, 0.15, 32).rotateX(-Math.PI / 2)
                const ringMat = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
                this.reticle = new THREE.Mesh(ringGeo, ringMat)
                this.reticle.matrixAutoUpdate = false
                this.reticle.visible = false
                this.scene.add(this.reticle)

                // XR controller setup
                const controller = this.renderer.xr.getController(0)
                controller.addEventListener('select', () => this.onSelect())
                this.scene.add(controller)
            } catch (e) {
                console.error('WebXR not supported:', e);
                this.addUnsupportedMessage();
            }
        }

        // Add a simple object to view in non-AR mode
        const normalCube = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.MeshNormalMaterial()
        );
        normalCube.position.z = -5;
        this.scene.add(normalCube);
    }

    addIOSARButton() {
        const arButton = document.createElement('a');
        arButton.setAttribute('rel', 'ar');
        arButton.setAttribute('href', 'chair_swan.usdz');
        arButton.setAttribute('style', 'display: block; width: 200px; height: 50px; margin: 20px auto; background-color: #fff; border-radius: 10px; text-align: center; line-height: 50px; font-weight: bold; text-decoration: none; color: #000;');
        arButton.textContent = 'View in AR (iOS)';
        
        document.body.appendChild(arButton);
        
        // Info message
        const info = document.createElement('div');
        info.textContent = 'iOS device detected. Tap button to launch AR Quick Look.';
        info.setAttribute('style', 'text-align: center; margin-top: 20px; color: white; background-color: rgba(0,0,0,0.5); padding: 10px;');
        document.body.appendChild(info);
    }

    addUnsupportedMessage() {
        const message = document.createElement('div');
        message.textContent = 'AR not supported on this device or browser.';
        message.setAttribute('style', 'position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: white; background-color: rgba(0,0,0,0.7); padding: 20px; border-radius: 10px; text-align: center;');
        document.body.appendChild(message);
    }

    onSelect()
    {
        if (this.reticle.visible) {
            // Clone the cube to place it at reticle position
            const newCube = this.cube.clone()
            newCube.visible = true
            newCube.position.setFromMatrixPosition(this.reticle.matrix)
            newCube.quaternion.setFromRotationMatrix(this.reticle.matrix)
            this.scene.add(newCube)
        }
    }

    // This tick method will be called by Experience.update()
    tick()
    {
        // Render the scene
        this.renderer.render(this.scene, this.camera)
        
        // Handle hit testing in XR sessions (only for WebXR)
        if (!this.isIOS && this.renderer.xr.isPresenting) {
            const session = this.renderer.xr.getSession()
            const frame = this.renderer.xr.getFrame()
            
            if (frame) {
                if (!this.hitTestSourceRequested) {
                    session.requestReferenceSpace('viewer').then((referenceSpace) => {
                        session.requestHitTestSource({ space: referenceSpace })
                            .then((source) => {
                                this.hitTestSource = source
                            })
                    })
                    
                    session.addEventListener('end', () => {
                        this.hitTestSourceRequested = false
                        this.hitTestSource = null
                    })
                    
                    this.hitTestSourceRequested = true
                }
                
                if (this.hitTestSource) {
                    const referenceSpace = this.renderer.xr.getReferenceSpace()
                    const hitTestResults = frame.getHitTestResults(this.hitTestSource)
                    
                    if (hitTestResults.length) {
                        const hit = hitTestResults[0]
                        const pose = hit.getPose(referenceSpace)
                        
                        this.reticle.visible = true
                        this.reticle.matrix.fromArray(pose.transform.matrix)
                    } else {
                        this.reticle.visible = false
                    }
                }
            }
        }
    }
}