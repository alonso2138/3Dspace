import * as THREE from 'three';
import EventEmitter from './EventEmitter.js';

let instance = null;

export default class Objects extends EventEmitter {
    constructor(id, name, tipo, url, position, scale, customs) {
        super();
        // Singleton
        if (instance) {
            return instance;
        }
        instance = this;
        this.moto = null;

        // Load configuration from cookies if available
        const config = this.getConfigFromCookies();
        if (config) {
            this.id = config.id;
            this.name = config.name;
            this.tipo = config.tipo;
            this.url = config.url;
            this.position = new THREE.Vector3(config.position[0], config.position[1], config.position[2]);
            this.scale = new THREE.Vector3(config.scale[0], config.scale[1], config.scale[2]);
            this.customs = config.customs;
        } else if (id) {
            this.id = id;
            this.name = name;
            this.tipo = tipo;
            this.url = url;
            this.position = new THREE.Vector3(position[0], position[1], position[2]);
            this.scale = new THREE.Vector3(scale[0], scale[1], scale[2]);
            this.customs = customs;
        }

        this.initObjects();
    }

    changeObject(property, value) {
        this[property] = value;
        this.updateConfigInCookies();
    }

    initObjects() {
        // Function to load JSON data
        async function loadJSON(path) {
            const response = await fetch(path);
            const data = await response.json();
            return data;
        }
    }

    getConfigFromCookies() {
        const name = "objectConfig=";
        const decodedCookie = decodeURIComponent(document.cookie);
        const ca = decodedCookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) === 0) {
                return JSON.parse(c.substring(name.length, c.length));
            }
        }
        return null;
    }

    updateConfigInCookies() {
        const config = {
            id: this.id,
            name: this.name,
            tipo: this.tipo,
            url: this.url,
            position: [this.position.x, this.position.y, this.position.z],
            scale: [this.scale.x, this.scale.y, this.scale.z],
            customs: this.customs
        };
        document.cookie = "objectConfig=" + JSON.stringify(config) + ";path=/";
    }
}
