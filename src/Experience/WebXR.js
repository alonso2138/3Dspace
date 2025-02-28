import * as THREE from 'three'
import { ARButton } from 'three/examples/jsm/webxr/ARButton.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

export default class WebXR
{
    constructor(container)
    {
        this.container = container
        this.scene = null
        this.camera = null
        this.renderer = null
        this.model = null
        this.reticle = null

        this.init();
    }

    init()
    {
        // Crear escena
        this.scene = new THREE.Scene()

        // Crear cámara
        this.camera = new THREE.PerspectiveCamera(
            70,
            window.innerWidth / window.innerHeight,
            0.01,
            20
        )

        // Crear renderizador
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        this.renderer.xr.enabled = true

        this.container.appendChild(ARButton.createButton(this.renderer))
        this.container.appendChild(this.renderer.domElement)

        // Configurar Draco loader
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');

        // Cargar modelo
        const loader = new GLTFLoader()
        loader.setDRACOLoader(dracoLoader);
        loader.load(
            'models/1.glb',
            (gltf) => {
                this.model = gltf.scene
            },
            undefined,
            (error) => {
                console.error('Error al cargar modelo:', error)
            }
        )

        // Crear retícula (un anillo en el suelo) para indicar colocación
        const ringGeo = new THREE.RingGeometry(0.1, 0.15, 32).rotateX(-Math.PI / 2)
        const ringMat = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
        this.reticle = new THREE.Mesh(ringGeo, ringMat)
        this.reticle.matrixAutoUpdate = false
        this.reticle.visible = false
        this.scene.add(this.reticle)

        // Controlador de XR
        const controller = this.renderer.xr.getController(0)
        controller.addEventListener('select', () => this.onSelect())
        this.scene.add(controller)

        // Iniciar animación
        this.renderer.setAnimationLoop(() => this.tick())
    }

    onSelect()
    {
        if (this.reticle.visible && this.model)
        {
            // Clonar el modelo para colocarlo en la retícula
            const newModel = this.model.clone()
            newModel.position.setFromMatrixPosition(this.reticle.matrix)
            newModel.quaternion.setFromRotationMatrix(this.reticle.matrix)
            this.scene.add(newModel)
        }
    }

    tick()
    {
        this.renderer.render(this.scene, this.camera)
    }
}