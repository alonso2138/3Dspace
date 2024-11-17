import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import EventEmitter from './EventEmitter.js'
import Experience from './Main.js'

export default class Resources extends EventEmitter
{
    constructor()
    {
        super()
        this.experience = new Experience();

        this.toLoad = 0;
        this.loaded = 0;
        this.allLoaded = false;

        for (let i = 0; i < experience.moto.customs.length; i++) {
            for(let j = 0; j < experience.moto.customs[i].url.length; j++)
            {
                this.toLoad++;
            }   
        }

        // +1 For the main model
        // +1 For the environment map
        this.toLoad += 2;

        this.items = {}

        this.setLoaders()
        this.startLoading()
    }

    setLoaders()
    {
        this.loaders = {}
        this.loaders.gltfLoader = new GLTFLoader()
        this.loaders.textureLoader = new THREE.TextureLoader()
        this.loaders.cubeTextureLoader = new THREE.CubeTextureLoader()
    }

    startLoading()
    {
        let sky = experience.moto.sky
        if(sky == "") sky = "sky"

        // Load environment map
        this.loaders.cubeTextureLoader.load(
            [
                'textures/environmentMaps/'+sky+'/px.png',
                'textures/environmentMaps/'+sky+'/nx.png',
                'textures/environmentMaps/'+sky+'/py.png',
                'textures/environmentMaps/'+sky+'/ny.png',
                'textures/environmentMaps/'+sky+'/pz.png',
                'textures/environmentMaps/'+sky+'/nz.png'
            ],
            (file) =>
            {
                this.sourceLoaded("environmentMapTexture", file)
                this.loaded++;
            }
        )

        // Load main model
        this.LoadFromSource(experience.moto.id[0], experience.moto.url)

        // Load custom models
        for (let i = 0; i < experience.moto.customs.length; i++) {
            for(let j = 0; j < experience.moto.customs[i].url.length; j++)
            {
                this.LoadFromSource(i+""+experience.moto.customs[i].id[j], experience.moto.customs[i].url[j])
            }   
        }
    }

    LoadFromSource(name,url){
        //console.log("Loading "+name+" from "+url)
        this.loaders.gltfLoader.load(
            url,
            (file) =>
            {
                this.loaded++;
                this.sourceLoaded(name, file)

            }
        )   
    }

    sourceLoaded(name, file)
    {
        this.items[name] = file;
        this.trigger('loaded')

        if(this.loaded == this.toLoad)
        {
            this.allLoaded = true;
            this.trigger('ready')
        }
    }
}