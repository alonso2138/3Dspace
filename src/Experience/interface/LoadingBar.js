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

        console.log("Loading screen created");
        // Inject CSS for loading screen
        const style = document.createElement('style');
        style.textContent = `
            body {
                background-color: #f0f0f0;
            }

            .loading-screen{
                background: linear-gradient(135deg, #ececec, #ffffff);
                border-radius: 10px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

                position: absolute;
                top: 50%;
                left: 50%;
                width: 100%;
                height: 100%;
                transform: translate(-50%, -50%);

                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                font-size: 1.5em;
                transition: opacity 1s ease, filter 1s ease;
            }
.loader {
    width: 150px;
    height: 150px;
    background-color: #ff3d00;
    border-radius: 50%;
    position: relative;
    box-shadow: 0 0 30px 4px rgba(0, 0, 0, 0.5) inset,
      0 5px 12px rgba(0, 0, 0, 0.15);
    overflow: hidden;
  }
  .loader:before,
  .loader:after {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 45%;
    top: -40%;
    background-color: #fff;
    animation: wave 5s linear infinite;
  }
  .loader:before {
    border-radius: 30%;
    background: rgba(255, 255, 255, 0.4);
    animation: wave 5s linear infinite;
  }
  @keyframes wave {
    0% {
      transform: rotate(0);
    }
    100% {
      transform: rotate(360deg);
    }
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