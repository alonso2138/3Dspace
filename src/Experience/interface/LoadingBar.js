import Experience from "../Main";

export default class LoadingBar {
    constructor() {
        this.experience = new Experience();
        this.resources = this.experience.resources;

        // Inject HTML for loading screen
        const loadingScreen = document.createElement('div');
        loadingScreen.className = 'loading-screen';

        const spinner = document.createElement('div');
        spinner.className = 'spinner';

        const loadingText = document.createElement('div');
        loadingText.className = 'loading-text';
        loadingText.textContent = 'Loading...';

        loadingScreen.appendChild(spinner);
        loadingScreen.appendChild(loadingText);
        document.body.appendChild(loadingScreen);

        // Inject CSS for loading screen
        const style = document.createElement('style');
        style.textContent = `
            body {
                background-color: #f0f0f0;
                font-family: 'Arial', sans-serif;
            }

            .loading-screen {
                background: linear-gradient(135deg, #ececec, #ffffff);
                border-radius: 10px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

                position: absolute;
                top: 50%;
                left: 50%;
                width: 300px;
                height: 200px;
                transform: translate(-50%, -50%);

                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                font-size: 1.5em;
                transition: opacity 1s ease, filter 1s ease;
            }

            .spinner {
                border: 4px solid rgba(0, 0, 0, 0.1);
                border-top: 4px solid #3498db;
                border-radius: 50%;
                width: 40px;
                height: 40px;
                animation: spin 1s linear infinite;
                margin-bottom: 20px;
            }

            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }

            .loading-text {
                color: #333;
                text-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
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
        loadingText.textContent = `Loading... ${Math.ceil(this.resources.loaded * 100 / this.resources.toLoad)} % loaded`;
    }

    hideLoadingScreen() {
        this.loadingScreen.classList.add('hidden');
        setTimeout(() => {
            this.loadingScreen.style.display = 'none';
        }, 1000); // Wait for the transition to complete
    }
}