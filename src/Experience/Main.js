import WebXR from './WebXR.js'

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

    init(){
        this.WebXR = new WebXR(this.canvas);
    }

    resizeEvent(){

    }

    update()
    {
        //this.stats.begin()
        if(this.WebXR) this.WebXR.tick();
    }
}