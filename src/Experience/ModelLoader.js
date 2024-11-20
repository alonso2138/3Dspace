// ModelLoader.js
import * as THREE from 'three'
import Experience from './Main';

export default class ModelLoader {
    constructor(scene) {
        this.experience = new Experience();
        this.scene = scene;

        this.resources = this.experience.resources

        this.ModelReady=false;

        this.idAnterior = [-1,-1,-1];
        this.customsModels = [0,0];
    }

    loadModel(object, piezaEditando, id) {

        //console.log("Loading model: ",object, " for piece: ",piezaEditando, " with id: ",id);
        // CHECK IF LOADING MAIN OBJECT OR PART
        let position,scale;

        if(object.id[0] == 0){    
            position = new THREE.Vector3(object.position[0],object.position[1],object.position[2]);
            scale = new THREE.Vector3(object.scale[0],object.scale[1],object.scale[2]);
        }else {
            position = new THREE.Vector3(object.position[id][0],object.position[id][1],object.position[id][2]);
            scale = new THREE.Vector3(object.scale[id][0],object.scale[id][1],object.scale[id][2]);
        }
        
        // LOAD THE MODEL
        let model;
            if(piezaEditando!=undefined){
                model = this.resources.items[piezaEditando+""+object.id[id]].scene;
            }else{
                model = this.resources.items[id].scene;
            }
            model.traverse((node) => {
                if (node.isMesh) {
                    node.castShadow = true;
                    node.receiveShadow = true;
                }
            });

            // REMOVE OLD MODEL AND ITS RESIDUE IF IT EXISTS
            if(this.customsModels[piezaEditando]){
                let oldModel =this.customsModels[piezaEditando];

                this.scene.remove(oldModel);

                // Dispose of the object's geometry and material
                if (oldModel.geometry) {
                    oldModel.geometry.dispose();
                }
            
                if (oldModel.material) {
                    if (Array.isArray(object.material)) {
                        // Dispose of each material if it's an array
                        oldModel.material.forEach(material => material.dispose());
                    } else {
                        // Dispose of the material if it's a single material
                        oldModel.material.dispose();
                    }
                }
            
                // Dispose of the object's textures if any
                if (oldModel.material && object.material.map) {
                    oldModel.material.map.dispose();
                }
            }
            this.customsModels[piezaEditando]= model;

            model.position.copy(position);
            model.scale.copy(scale);
            this.scene.add(model);

            // UPDATE SELECTED SQUARE ID AND STYLE
            /*
            if(this.idAnterior[piezaEditando] != id){
                if(document.getElementById('CustomSquare'+(this.idAnterior[piezaEditando]+1)+'Pieza'+piezaEditando)){
                    //console.log("Quitando el: ",'CustomSquare'+(this.idAnterior[piezaEditando]+1)+'Pieza'+piezaEditando);
                    document.getElementById('CustomSquare'+(this.idAnterior[piezaEditando]+1)+'Pieza'+piezaEditando).classList.remove('CustomSquareSelected');
                }
            }

            if(document.getElementById('CustomSquare'+(id+1)+'Pieza'+piezaEditando)){
                //console.log("Añadirendo el: ",'CustomSquare'+(id+1)+'Pieza'+piezaEditando);
                document.getElementById('CustomSquare'+(id+1)+'Pieza'+piezaEditando).classList.add('CustomSquareSelected');
            }*/
        }
}