import Experience from '../Main.js';

export default class InfoTab {
    constructor(onSquareClick) {
        this.experience = new Experience();
        this.mouseOverInfoTab = false;
        this.selectedPiece = null;

        this.onSquareClick = onSquareClick;

        // Generate the HTML and inject styles
        this.generateHTML();
        this.injectStyles();
    }

    appearBox(custom,id) {
        const infoBox = document.getElementById('info-box');

        infoBox.style.opacity = 1;
        infoBox.style.visibility = 'visible';
        infoBox.style.pointerEvents = 'all';

        //infoBox.querySelector('.image').src = custom.image[id];
        //infoBox.querySelector('.description').textContent = custom.title[id];
        //if(infoBox.querySelector('.price')) infoBox.querySelector('.price').textContent = `Precio: ${custom.price[id]} €`;
        infoBox.querySelector('.InfoBoxTitle').textContent = "Elige el material para personalizar  "+custom.name+":";


        if(infoBox.querySelector('.InfoBoxImages')) infoBox.querySelector('.InfoBoxImages').innerHTML = '';
        for(let i = 0; i < custom.id.length; i++){
            const wrapper = document.createElement('div');
            wrapper.className = 'InfoBoxWrapper';

            const image = document.createElement('div');
            image.className = 'image';
            image.classList.add('image'+i);

            const img = document.createElement('img');
            image.appendChild(img);
            img.src = custom.image[i];

            const label = document.createElement('div');
            label.className = 'label';
            label.classList.add('label'+i);
            label.innerText = custom.title[i];

            image.addEventListener('click', () => {
                if(id!=i){
                    if(document.querySelector('.image.selected')) document.querySelector('.image.selected').classList.remove('selected');
                    if(document.querySelector('.label.selected')) document.querySelector('.label.selected').classList.remove('selected');
                    this.experience.rightBar.cartButton(custom, i);
                    image.classList.add('selected');
                    label.classList.add('selected');
                }
                if (this.onSquareClick) this.onSquareClick(i);
                //this.appearBox(custom, i);
            });

            if(id == i){
                image.classList.add('selected');
                label.classList.add('selected');
            }



            wrapper.appendChild(image);
            wrapper.appendChild(label);
            infoBox.querySelector('.InfoBoxImages').appendChild(wrapper);
            
        }
/*
        let cartButton = document.getElementById('cart-button');

        // Remove all existing click event listeners
        const newCartButton = cartButton.cloneNode(true);
        cartButton.replaceWith(newCartButton);
        cartButton = newCartButton;
    

        if(id === 0 && false){
            cartButton.classList.add('stock');
            cartButton.innerHTML ='<p>Opción de serie</p>';

            try {
                cartButton.classList.remove('unselected');
                cartButton.classList.remove('selected');
            } catch (error) {
                console.error('Error removing class:', error);
            }
        }else if(id === custom.selected){
            cartButton.classList.add('selected');
            cartButton.innerHTML ='<p>Seleccionado</p>';

            try {
                cartButton.classList.remove('unselected');
                cartButton.classList.remove('stock');
            } catch (error) {
                console.error('Error removing class:', error);
            }
        }else{
            cartButton.classList.add('unselected');
            cartButton.innerHTML ='<p>Seleccionar</p>';

            try {
                cartButton.classList.remove('selected');
                cartButton.classList.remove('stock');
            } catch (error) {
                console.error('Error removing class:', error);
            }
        }

        // Define and add the new event handler
        newCartButton.addEventListener('click', () => {
            this.experience.rightBar.cartButton(custom, id);
        });*/
        
    }

    deleteInfoTab() {
        const infoBox = document.getElementById('info-box');
        infoBox.remove();
    }

    disappearBox() {
        const infoBox = document.getElementById('info-box');
        infoBox.style.opacity = 0;
        infoBox.style.visibility = 'hidden';
        infoBox.style.pointerEvents = 'none';
    }

    generateHTML() {
        const infoBox = document.createElement('div');
        infoBox.id = 'info-box';
        infoBox.classList.add('info-box');
        // <img class="image" src="" alt="Piece Image" />
        
        infoBox.innerHTML = `
            <div class="InfoBoxTitle"></div>
            <button class="close-btn">&times;</button>
            <div class="InfoBoxImages"></div>
            <div class="description"></div>
        `;

        // <div class="add-cart" id="cart-button"></div>

        document.body.appendChild(infoBox);

        infoBox.addEventListener('mouseover', () => {
            this.mouseOverInfoTab = true;
        });

        infoBox.addEventListener('mouseout', () => {
            this.mouseOverInfoTab = false;
        });

        // Add event listener to the close button
        infoBox.querySelector('.close-btn').addEventListener('click', () => {
            this.experience.stopEditing(1);
            
        });
    }

    injectStyles() {
        const styles = `
.info-box {
    display: flex;
    jsutify-content: center;
    align-items: center;
    flex-direction: column;

    padding: 0 1rem;

    position: absolute;
    right: 0;
    width: 100%;
    height: 100%;
    background-color: var(--InfoBoxBackground); /* Replaced with variable */
    
    top: 0;
    opacity: 0;
    pointer-events:none;
    transition: opacity 0.3s ease, visibility 0.3s ease;
    z-index: 100;

    font-family: "Inter", sans-serif !important;
    font-optical-sizing: auto;
    font-style: normal;
}

.info-box .InfoBoxTitle {
    margin-left: 2rem;
    margin-top: 1rem;
    width: auto;
    font-weight: 200;
    font-size: 160%;
    font-style: normal;
    color: var(--Text); /* Replaced with variable */
    text-transform: uppercase;
}


.info-box .description {
    font-weight: 200;
    font-size: 1.2rem;
}

.info-box .price {
    font-weight: bold;
}

.InfoBoxImages {
    margin-top: 3rem;
    width: 90%;
    height: 50%;
    display: flex;
    gap: 3rem;
    padding: 1rem;
    border-radius: 1rem;
    scrollbar-width: thin;
    scrollbar-color: var(--InfoBoxScrollbar) var(--InfoBoxImagesBackground); /* Replaced with variable */
}

.info-box .InfoBoxWrapper {
    width: 100%;
    height: 100%;
}

.info-box .image {
    max-height: 500px;
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 1rem;
    transition: all 0.3s ease;
    box-shadow:inset 0px 0px 0px 0px #000000;
    transition: all 0.5s ease;
}

.info-box .image img {
    border-radius: 1rem;
    width: 100%;
    height: 100%;
    object-fit: cover;
    box-shadow: 0px 0px 0px 0px rgba(0, 0, 0, 0);
    scale: 1;

    transition: all 0.5s ease;
}

.info-box .image.selected img{
    box-shadow: 2px 5px 15px 1px rgba(0, 0, 0, 0.7);
    scale: 1.02;
}

.info-box .label {
    width: 100%;
    height: auto;
    text-align: center;
    margin-top: 1rem;
    font-weight: 190;
    font-size: 1.2rem;
    transition: all 0.3s ease;
}

.info-box .label.selected {
    margin-top: 1.1rem;
    font-weight: 400;
    font-size: 1.4rem;
}

.close-btn {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: none;
    border: none;
    font-size: 2.5rem;
    cursor: pointer;
}

.add-cart {
position: inherit;
    display: flex;
    justify-content: center;
    height: 3rem;
    text-transform: uppercase;
    align-items: center;
    padding: 0 2rem;
    text-align: center;
    border-radius: 0.5rem;
    box-shadow: 2.3px 4.6px 4.6px hsl(0deg 0% 0% / 0.43);
    background-color: var(--InfoBoxButton);
    color: var(--Text);
    cursor: pointer;
    bottom: 10%;
    width: 70%;
    margin: 1rem auto;
    transition: all 0.3s ease;
}

.add-cart p {
    font-size: 1.2rem;
}

.add-cart.selected {
    background-color: var(--InfoBoxButtonSelected); /* Replaced with variable */
    cursor: auto;
    pointer-events: none;
}

.add-cart.unselected {
    background-color: var(--InfoBoxButton); /* Replaced with variable */
}

.add-cart.unselected:hover {
    background-color: var(--CustomHover); /* Replaced with variable */
}

.add-cart.stock {
    background-color: rgba(52, 73, 94, 0.6);
    cursor: auto;
    pointer-events: none;
}

@media (min-width: 1200px) {
    .info-box {
        max-width: 450px;
    }
}


@media (max-width: 1199px) {
    .info-box {
        max-width: 450px;
    }
}

@media (max-width: 800px) {
    .info-box {
        max-width: 100%;
        padding: 0;
    }

    .add-cart {
        line-height: 2rem;
        height: 2rem;
        padding: 0 1rem;
    }

    .close-btn {
        font-size: 1.2rem; /* Adjust the close button size */
    }
}

        `;
        const styleSheet = document.createElement('style');
        styleSheet.type = 'text/css';
        styleSheet.innerText = styles;
        document.head.appendChild(styleSheet);
    }
}