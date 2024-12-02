import Time from './Time.js';
import SceneSetup from './SceneSetup.js';
import ModelLoader from './ModelLoader.js';
import ShadowCreator from './ShadowCreator.js';
import BottomBar from './interface/BottomBar.js';
import RightBar from './interface/RightBar.js';
import InfoTab from './interface/InfoTab.js';
import Resources from './Resources.js';
import SelectObject from './interface/SelectObject.js';
import LoadingBar from './interface/LoadingBar.js';
import LoadColors from './interface/LoadColors.js';
import Outline from './Model/Outline.js';
import Stats from 'stats.js';
import LoadMarcas from './Model/LoadMarcas.js';
import Welcome from './interface/Welcome.js';

let instance = null;
 
export default class Experience {
    constructor(_canvas) {
        // Singleton
        if (instance) {
            return instance;
        }
        instance = this;

        this.contador=0;

        // Global access
        window.experience = this;
        window.addEventListener( 'resize', this.resizeEvent.bind(this),false);
        this.canvas = _canvas;

        // Initialize this.stats
        //this.stats = new Stats();
        //this.stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
        //document.body.appendChild(this.stats.dom);

        // Initialize LoadMarcas
        this.init();
    }

    async init(){
        // Carcar marcas
        this.loadMarcas = new LoadMarcas();
        await this.loadMarcas.init();
        
        // Load colors
        this.loadColors = new LoadColors();

        // Start the scene
        try{
            const quickCookie = this.getCookie('currentMoto');
            //console.log(quickCookie);
            if(quickCookie){
                this.startNoLoading(quickCookie);
            }else{
                this.startNormal();
            }
        }catch(e){
            console.log(e);
        }
    }

    startNormal(){
        // Model selection
        this.selectObject = new SelectObject();
        //Initialize the model selection interface
        this.selectObject.on('modelSelected', (path) => {
            // Show canvas
            this.canvas.style.display = 'block';

            this.quickCookie(path);
            this.loadMotoData(path).then(() => {

                // Start loading resources once the object data is loaded
                this.resources = new Resources();
    
                // Set up loading bar
                this.loadingBar = new LoadingBar();
    
                // Finally load the scene when all the resources are loaded
                this.resources.on('ready', () => {
                    this.initScene();
                });
            });
        });
    }

    startNoLoading(path){
        //path = '/datos/Triumph_Speed_Triple_Se_2013.json ';
        this.loadMotoData(path).then(() => 
        {

            // Start loading resources once the object data is loaded
            this.resources = new Resources();

            // Set up loading bar
            this.loadingBar = new LoadingBar();

            // Finally load the scene when all the resources are loaded
            this.resources.on('ready', () => {
                this.initScene();
            });
        });
    }

    // Function to load JSON data
    async loadMotoData(path) {
        const match = path.match(/\/datos\/(\d+)\.json/);
        this.path = match ? match[1] : null;

        try {
            const response = await fetch(path);
            const jsonData = await response.json();

            this.moto = jsonData;
/*
            // Instantiate this with data from JSON
            this.moto = {
                id: jsonData.id,
                sky: jsonData.sky,
                tipo: jsonData.tipo,
                model: jsonData.model,
                url: jsonData.url,
                position: jsonData.position,
                scale: jsonData.scale,
                povs: jsonData.povs,
                customs: jsonData.customs
            };*/

        } catch (error) {
            console.error('Error loading moto data:', error);
        }
    }

    // Function to get cookie by name
    getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    // Function to update cookie with current configuration
    updateCookie() {
        const config = this.moto.customs.map(custom => custom.selected);
        const selectedPieces = this.rightBar.selectedPieces;
        const piezaEditando = this.piezaEditando;
        const cookieData = {
            config,
            selectedPieces,
            piezaEditando
        };

        document.cookie = this.path+`motoConfig=${JSON.stringify(cookieData)}; path=/; max-age=31536000`; // 1 year

        //const config = this.moto.customs.map(custom => custom.selected);
        //document.cookie = `motoConfig=${JSON.stringify(config)}; path=/; max-age=31536000`; // 1 year
    }

    quickCookie(path){
        document.cookie = `currentMoto=${path}; path=/; max-age=900`; // 15 min

    }

    restartExperience() {
        //Hide temporarily webgl canvas
        this.canvas.style.display = 'none';
        document.cookie = `currentMoto=; path=/; max-age=100`; 

        // Clear interface
        if(this.bottomBar)  this.bottomBar.destroyBottomBar();
        if(this.rightBar) this.rightBar.deleteRightBar();
        if(this.infoTab) this.infoTab.deleteInfoTab();
        if(this.sceneSetup.mobilePov) this.sceneSetup.mobilePov.endMobilePov();

        // Clear existing state if necessary
        if (this.scene) {
            while (this.scene.children.length > 0) {
                this.scene.remove(this.scene.children[0]);
            }
        }

        // Reinitialize the model selection interface
        this.startNormal();
    }

    // Callback function for parent square click
    onParentSquareClick(id) {
        //Check if there are already customs shown
        /*if( this.piezaEditando==undefined){        
            this.piezaEditando=id;
            setTimeout(() => {
                this.startEditing();
                if(this.outline) this.outline.setOutlineVisibility(true, this.modelLoader.customsModels[id]);

            }, this.bottomBar.animationTimeout);
        
            //Check if we want to hide customs or to change customs
        }else {*/
            if( this.piezaEditando==id){

                //this.stopEditing(true);
                this.piezaEditando=undefined;

            }else{
                
                //this.stopEditing(true);
                this.piezaEditando=id;
                this.startEditing();
                if(this.outline) this.outline.setOutlineVisibility(true, this.modelLoader.customsModels[id]);

                setTimeout(() => {
                    this.startEditing();
                }, this.bottomBar.animationTimeout);
            }
        //}
    }

    // Callback function for square click
    onSquareClick(id) {
        const piezaEditando = this.piezaEditando;
        //Antes de esta función se ejecuta infoTabAppear(id)

        //Estilos de seleccionar cuadrado
        // Quitar estilos a todos los squares (id pieza seleccionada, i pieza iterada)
        /*
        function cuadrado(x){
            return document.getElementById('CustomSquare'+(x+1)+'Pieza'+piezaEditando);
        }
        if(cuadrado(id) && piezaEditando!=undefined){
            for(let i = 0; i < this.moto.customs[piezaEditando].id.length; i++){
                if(cuadrado(i).classList.contains('CustomSquareSelected')) cuadrado(i).classList.remove('CustomSquareSelected');      
            }

            document.getElementById('CustomSquare'+(id+1)+'Pieza'+piezaEditando).classList.add('CustomSquareSelected');
            
            this.modelLoader.idAnterior[piezaEditando] = id;
            //this.experience.moto.customs[piezaEditando].selected=id;
            //console.log("El custom seleccionado es: "+this.experience.moto.customs[piezaEditando].selected,piezaEditando)
        }

        //Ahora se llama el model loader
        */

        if(document.querySelector('.selected')){
            document.querySelector('.image.selected').classList.remove('selected');
            document.querySelector('.label.selected').classList.remove('selected');
        }
        document.querySelector('.image'+id).classList.add('selected');
        document.querySelector('.label'+id).classList.add('selected');

        this.modelLoader.loadModel(this.moto.customs[this.piezaEditando],  this.piezaEditando,id)
        if(this.outline) this.outline.setOutlineVisibility(true, this.modelLoader.customsModels[this.piezaEditando]);
        if(this.rightBar) this.rightBar.updateList( this.piezaEditando, this.moto.customs[ this.piezaEditando].title[id], this.moto.customs[ this.piezaEditando].price[id]);

        this.moto.customs[piezaEditando].selected=id;
    }

    infoTabAppear(id){
        if(this.infoTab) this.infoTab.appearBox(this.moto.customs[this.piezaEditando],id);
    }

    stopEditing(cameraReset){
        if(this.sceneSetup)this.sceneSetup.controls.enabled = true;

        //if(this.piezaEditando==undefined) return;
        this.piezaEditando=undefined;
        if(document.querySelector('.point')){
            document.querySelector('.point').style.opacity = '1';
            document.querySelector('.point').style.pointerEvents = 'all';
        }
        
        this.bottomBar.deleteBottomBar();
        if(this.outline) this.outline.setOutlineVisibility(false, this.modelLoader.customsModels[this.piezaEditando]);
        if(cameraReset) this.sceneSetup.resetCamera();
        if(this.infoTab) this.infoTab.disappearBox();
        this.modelLoader.loadModel(this.moto.customs[this.piezaEditando],  this.piezaEditando, this.moto.customs[this.piezaEditando].selected)
        //if(document.getElementById('ParentSquare'+this.piezaEditando)) document.getElementById('ParentSquare'+this.piezaEditando).classList.remove('ParentSquareSelected');

    }

    startEditing(){
        if(this.sceneSetup)this.sceneSetup.controls.enabled = false;
        const id = this.piezaEditando;
        if(document.querySelector('.point')){
            document.querySelector('.point').style.opacity = '0';
            document.querySelector('.point').style.pointerEvents = 'none';
        }
        this.sceneSetup.mobilePov.removeSelection();
        this.bottomBar.generateBottomBar(this.moto.customs,id);
        this.sceneSetup.moveCamera(this.moto.customs[id].camera_position, this.moto.customs[id].camera_target);
        //if(document.getElementById('ParentSquare'+id)) document.getElementById('ParentSquare'+id).classList.add('ParentSquareSelected');
    }

    onSquareUnHover(){

    }

    initScene() {
        // Initialize scene setup
        this.sceneSetup = new SceneSetup(this.canvas);
        this.scene = this.sceneSetup.scene;
        this.modelLoader = new ModelLoader(this.scene);
        this.piezaEditando = undefined;

        // Initialize interface
        this.rightBar = new RightBar();

        //Load cart

        // Check for existing cookie
        const cookieData = this.getCookie(this.path+'motoConfig');
        if (cookieData) {
            // COOKIE DETECTED
            const savedConfig = JSON.parse(cookieData);
            this.rightBar.selectedPieces = savedConfig.selectedPieces
            for(let i = 0; i < savedConfig.selectedPieces.length; i++) {
                //console.log(this.moto.customs[savedConfig.selectedPieces[i].piezaEditando].selected,savedConfig.selectedPieces[i])
                if(this.moto.customs[savedConfig.selectedPieces[i].piezaEditando]) this.moto.customs[savedConfig.selectedPieces[i].piezaEditando].selected = savedConfig.selectedPieces[i].id
            }

            this.rightBar.updateList();
            

            //document.cookie = `motoConfig=; path=/; max-age=0`;
        } else {
            // NO COOKIE DETECTED

            // Create a new cookie with the initial configuration
            this.updateCookie();
        }

        this.infoTab = new InfoTab(this.onSquareClick.bind(this));

        this.bottomBar = new BottomBar('square-container', this.onSquareClick.bind(this), this.onParentSquareClick.bind(this), this.infoTabAppear.bind(this), this.onSquareUnHover.bind(this));
        this.bottomBar.init();

        //this.outline = new Outline(this.scene ,this.sceneSetup.camera,this.sceneSetup.renderer);

        // Load main Object
        this.modelLoader.loadModel(this.moto, undefined, 0,false);

        // Generate boxes and model for each type of piece
        for (let i = 0; i < this.moto.customs.length; i++) {
            this.bottomBar.generateCustom(this.moto.customs[i], i);
            this.modelLoader.loadModel(this.moto.customs[i], i, this.moto.customs[i].selected,false);
        }

        // Time tick event
        this.time = new Time();
        this.time.on('tick', () => {
            this.update();
        });

        // Resize to set everything on load
        this.resizeEvent();

        // Initialize welcome
        this.welcome = new Welcome();

        // Animate start of scene
        this.sceneSetup.animateExposure();

    }

    resizeEvent(){
        if (this.sceneSetup) this.sceneSetup.resize();
        if (this.bottomBar) this.bottomBar.resize();
        if (this.rightBar) this.rightBar.resize();
    }

    update()
    {
        this.contador++;

        //this.stats.begin()
        this.sceneSetup.render();
        this.bottomBar.update();

        if(this.piezaEditando!=undefined){
            if(this.outline) this.outline.composer.render();
        }

        //console.log(this.sceneSetup.camera.position.x.toFixed(1)+","+this.sceneSetup.camera.position.y.toFixed(1)+','+this.sceneSetup.camera.position.z.toFixed(1))

        //this.stats.end()
    }
}