import Experience from "../Main";

export default class LoadingBar {
    constructor() {
        this.experience = new Experience();
        this.resources = this.experience.resources;

        // Inject HTML for loading screen
        const loadingScreen = document.createElement('div');
        loadingScreen.className = 'loading-screen';

        const loader = document.createElement('span');
        loader.className = 'loader';
        
        const loadingText = document.createElement('div');
        loadingText.className = 'loading-text';
        //loadingText.textContent = 'Loading...';
        loadingText.textContent = '';


        loadingScreen.appendChild(loader);
        loadingScreen.appendChild(loadingText);
        document.body.appendChild(loadingScreen);

        // Inject CSS for loading screen
        const style = document.createElement('style');
        style.textContent = `
            body {
                background-color:rgb(0, 0, 0);
            }

        `;
        document.head.appendChild(style);

        this.loadingScreen = loadingScreen;

        this.setupEventListeners();
    }

    setupEventListeners() {
        this.resources.on('loaded', this.updateLoadingScreen.bind(this));
        this.resources.on('ready', this.hideLoadingScreen.bind(this));
    }

    updateLoadingScreen() {
        const loadingText = this.loadingScreen.querySelector('.loading-text');
        //loadingText.textContent = `Loading... ${Math.ceil(this.resources.loaded * 100 / this.resources.toLoad)} % loaded`;
    }

    hideLoadingScreen() {
        this.loadingScreen.classList.add('hidden');
        setTimeout(() => {
            this.loadingScreen.style.display = 'none';
        }, 1000); // Wait for the transition to complete
    }
}