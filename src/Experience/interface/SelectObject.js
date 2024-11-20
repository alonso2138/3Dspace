import EventEmitter from '../EventEmitter.js';

export default class SelectObject extends EventEmitter {
    constructor() {
        super();
        this.brands = [];
        this.init();
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

    extractBrands(data) {
        this.brands = data.marcas;
    }

    injectStyles() {
        const styles = `
            body {
                background-color: #f0f0f0;
                font-family: 'Arial', sans-serif;
                transition: filter 0.5s ease;
            }
            .container {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 100vh;
                text-align: center;
                z-index: 2;
            }
            .brand-container, .model-container {
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
                gap: 20px;
                margin-top: 20px;
            }
            .brand-card, .model-card {
                width: 150px;
                height: 150px;
                background-color: #ffffff;
                border-radius: 10px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 10px;
                transition: transform 0.3s;
                cursor: pointer;
            }
            .brand-card:hover, .model-card:hover {
                transform: scale(1.05);
            }
            .brand-card img, .model-card img {
                width: 80px;
                height: 80px;
                object-fit: contain;
                margin-bottom: 10px;
            }
            .brand-card h3, .model-card h3 {
                font-size: 16px;
                color: #333;
            }
            .title {
                font-size: 24px;
                font-family: 'Futura', sans-serif;
                color: #333;
                margin-bottom: 20px;
            }
            .back-button {
                position: absolute;
                top: 20px;
                left: 20px;
                font-size: 24px;
                cursor: pointer;
                color: #333;
                text-decoration: none;
            }
            .blurred {
                filter: blur(5px);
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

        const styleSheet = document.createElement("style");
        styleSheet.type = "text/css";
        styleSheet.innerText = styles;
        document.head.appendChild(styleSheet);
    }

    generateBrandHTML() {
        const container = document.createElement('div');
        container.className = 'container';

        const title = document.createElement('h1');
        title.className = 'title';
        title.textContent = 'Selecciona la marca:';
        container.appendChild(title);

        const brandContainer = document.createElement('div');
        brandContainer.className = 'brand-container';

        this.brands.forEach(brand => {
            const brandCard = document.createElement('div');
            brandCard.className = 'brand-card';
            brandCard.addEventListener('click', () => this.showModels(brand));

            const img = document.createElement('img');
            img.src = brand.photo_url;
            img.alt = brand.name;

            const brandTitle = document.createElement('h3');
            brandTitle.textContent = brand.name;

            brandCard.appendChild(img);
            brandCard.appendChild(brandTitle);
            brandContainer.appendChild(brandCard);
        });

        container.appendChild(brandContainer);
        document.body.appendChild(container);
    }

    showModels(brand) {
        // Apply blur effect
        document.body.classList.add('blurred');

        // Clear the current content after the blur animation
        setTimeout(() => {
            // Clear the current content
            document.body.innerHTML = '';

            const container = document.createElement('div');
            container.className = 'container';

            const backButton = document.createElement('a');
            backButton.className = 'back-button';
            backButton.innerHTML = '←';
            backButton.addEventListener('click', () => {
                document.body.innerHTML = '';
                this.generateBrandHTML();
            });
            container.appendChild(backButton);

            const title = document.createElement('h1');
            title.className = 'title';
            title.textContent = 'Selecciona tu moto:';
            container.appendChild(title);

            const modelContainer = document.createElement('div');
            modelContainer.className = 'model-container';

            brand.models.forEach(model => {
                const modelCard = document.createElement('div');
                modelCard.className = 'model-card';
                modelCard.addEventListener('click', () => this.selectModel(model.data_url));

                const img = document.createElement('img');
                img.src = model.photo_url;
                img.alt = model.name;

                const modelTitle = document.createElement('h3');
                modelTitle.textContent = model.name;

                modelCard.appendChild(img);
                modelCard.appendChild(modelTitle);
                modelContainer.appendChild(modelCard);
            });

            container.appendChild(modelContainer);
            document.body.appendChild(container);

            // Remove blur effect after content is updated
            document.body.classList.remove('blurred');
        }, 500); // Match the transition duration
    }

    selectModel(path) {
        // Apply blur effect to model cards
        const modelCards = document.querySelectorAll('.model-card');
        modelCards.forEach(card => card.classList.add('blurred'));
        const title = document.querySelector('.title');


        // Remove model cards after the blur animation
        setTimeout(() => {
            modelCards.forEach(card => card.remove());
            title.textContent = '';

            // Match the transition duration
            setTimeout(() => {
                title.textContent = 'Ups... ¡Algo salió mal!';

            }, 500);
        }, 500);


        // Clear container element
        const container = document.querySelector('.container');
        container.remove();


        this.trigger('modelSelected', [path]);
    }

    async init() {
        this.injectStyles();
        const data = await this.fetchJSONData();
        this.extractBrands(data);
        this.generateBrandHTML();
    }
}