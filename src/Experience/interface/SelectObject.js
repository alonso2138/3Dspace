import EventEmitter from '../EventEmitter.js';

export default class SelectObject extends EventEmitter {
    constructor() {
        super();

    }

    init(){
        this.trigger('modelSelected', '/datos/3.json');

    }
}