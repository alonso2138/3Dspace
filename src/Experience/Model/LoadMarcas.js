export default class LoadMarcas {
    constructor() {    }

    async init() {
        const data = await this.fetchJSONData();
        this.marcas = data.marcas;
        this.paleta = data.paleta
    }

    async fetchJSONData() {
        try {
            const response = await fetch('/datos/marcas.json');
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error loading JSON data:', error);
            throw error;
        }
    }
}
