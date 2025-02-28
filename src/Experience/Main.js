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

        // Global access
        window.experience = this;
        window.addEventListener( 'resize', this.resizeEvent.bind(this),false);
        this.canvas = _canvas;

        // Initialize LoadMarcas
        this.init();
    }

    async init(){
        
    }

    resizeEvent(){
        if (this.sceneSetup) this.sceneSetup.resize();
        if (this.bottomBar) this.bottomBar.resize();
        if (this.rightBar) this.rightBar.resize();
    }

    update()
    {
        //this.stats.begin()
        if(this.sceneSetup) this.sceneSetup.render();
        if(this.bottomBar) this.bottomBar.update();
    }
}