import EventEmitter from '../EventEmitter.js';
import Experience from '../Main.js';

let styles = 0;

export default class SelectObject extends EventEmitter {
    constructor() {
        super();
        if(!styles){
            this.injectStyles();
            styles++;
        }

        this.experience = new Experience();

        this.brands = this.experience.loadMarcas.marcas;
        this.init();
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
                width: 30vh;
                height: auto;
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
                width: 90%;
                height: auto;
                border-radius: 2rem;
                object-fit: contain;
                margin-bottom: 1rem;
                margin-top: 1rem;

            }
            .brand-card h3, .model-card h3 {
                font-size: 1.4rem;
                margin-bottom: 1rem;
                color: #333;
            }
            .titulo {
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
        `;

        const styleSheet = document.createElement("style");
        styleSheet.type = "text/css";
        styleSheet.innerText = styles;
        document.head.appendChild(styleSheet);
    }

    generateBrandHTML() {
        if(document.querySelector("container")) document.querySelector("container").parentElement.removeChild(document.querySelector("container"))
        document.body.innerHTML = '';

        const container = document.createElement('div');
        container.className = 'container';

        const titulo = document.createElement('h1');
        titulo.className = 'titulo';
        titulo.textContent = '';
        container.appendChild(titulo);

        const brandContainer = document.createElement('div');
        brandContainer.className = 'brand-container';

        this.brands.forEach(brand => {
            const brandCard = document.createElement('div');
            brandCard.className = 'brand-card';
            brandCard.addEventListener('click', () => this.showModels(brand));

            const img = document.createElement('img');
            img.src = brand.photo_url;
            img.alt = brand.name;

            const brandtitulo = document.createElement('h3');
            brandtitulo.textContent = brand.name;

            brandCard.appendChild(img);
            brandCard.appendChild(brandtitulo);
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

            const titulo = document.createElement('h1');
            titulo.className = 'titulo';
            titulo.textContent = 'Selecciona el inmueble:';
            container.appendChild(titulo);

            const modelContainer = document.createElement('div');
            modelContainer.className = 'model-container';

            brand.models.forEach(model => {
                const modelCard = document.createElement('div');
                modelCard.className = 'model-card';
                modelCard.addEventListener('click', () => this.selectModel(model.data_url));

                const img = document.createElement('img');
                img.src = model.photo_url;
                img.alt = model.name;

                const modeltitulo = document.createElement('h3');
                modeltitulo.textContent = model.name;

                modelCard.appendChild(img);
                modelCard.appendChild(modeltitulo);
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
        const titulo = document.querySelector('.titulo');


        // Remove model cards after the blur animation
        setTimeout(() => {
            modelCards.forEach(card => card.remove());
            titulo.textContent = '';

            // Match the transition duration
            setTimeout(() => {
                titulo.textContent = 'Ups... ¡Algo salió mal!';

            }, 500);
        }, 500);


        // Clear container element
        const container = document.querySelector('.container');
        container.remove();


        this.trigger('modelSelected', [path]);
    }

    async init() {
        this.generateBrandHTML();
    }
}