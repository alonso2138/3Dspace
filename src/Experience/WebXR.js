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

        // Add AR button to the document body (not to the canvas)
        document.body.appendChild(ARButton.createButton(this.renderer, {
            requiredFeatures: ['hit-test']
        }))

        // Create a simple cube
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
        
        // Handle hit testing in XR sessions
        if (this.renderer.xr.isPresenting) {
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