import Experience from '../Main.js';

export default class InfoTab {
    constructor() {
        this.experience = new Experience();
        this.mouseOverInfoTab = false;
        this.selectedPiece = null;

        // Generate the HTML and inject styles
        this.generateHTML();
        this.injectStyles();
    }

    appearBox(custom,id) {
        const infoBox = document.getElementById('info-box');

        infoBox.style.opacity = 1;
        infoBox.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
        infoBox.style.visibility = 'visible';

        //infoBox.querySelector('.image').src = custom.image[id];
        infoBox.querySelector('.description').textContent = custom.title[id];
        infoBox.querySelector('.price').textContent = `Precio: ${custom.price[id]} €`;

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
        });
        
    }

    deleteInfoTab() {
        const infoBox = document.getElementById('info-box');
        infoBox.remove();
    }

    disappearBox() {
        const infoBox = document.getElementById('info-box');
        infoBox.style.opacity = 0;
        infoBox.style.visibility = 'hidden';
    }

    generateHTML() {
        const infoBox = document.createElement('div');
        infoBox.id = 'info-box';
        infoBox.classList.add('info-box');
        // <img class="image" src="" alt="Piece Image" />
        
        infoBox.innerHTML = `
            <button class="close-btn">&times;</button>
            <div class="description"></div>
            <div class="price"></div>
            <div class="add-cart" id="cart-button"></div>
        `;

        document.body.appendChild(infoBox);

        infoBox.addEventListener('mouseover', () => {
            this.mouseOverInfoTab = true;
        });

        infoBox.addEventListener('mouseout', () => {
            this.mouseOverInfoTab = false;
        });

        // Add event listener to the close button
        infoBox.querySelector('.close-btn').addEventListener('click', () => {
            this.disappearBox();
        });
    }

    injectStyles() {
        const styles = `
/* Base styles */
.info-box {
    position: fixed;
    bottom: 27%;
    right: 1rem;
    width: 14rem; /* Adjusted for better responsiveness */
    height: auto;
    background-color: #ffffff;
    padding: 1rem;
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

    opacity: 0;
    visibility: none;

    transition: opacity 0.3s ease, visibility 0.3s ease;
    z-index: 100;
}

.info-box .image {
    width: 100%;
    height: 60%;
    object-fit: contain;
    margin-bottom: 1rem; /* Adjusted for better spacing on smaller screens */
}

.info-box .description {
    margin-bottom: 0.5rem;
}

.info-box .price {
    font-weight: bold;
}

.close-btn {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
}

.add-cart{
    display: flex;
    justify-content: center;
    height: 3rem;
    align-items: center;
    padding: 0 2rem;
    text-align: center;
    border-radius: 1rem;
    box-shadow: 2.3px 4.6px 4.6px hsl(0deg 0% 0% / 0.43);
    background-color: #00ff00;
    color: #fff;
    cursor: pointer;
    margin: 1rem auto;

    transition: all 0.3s ease;
}

.add-cart p{
    font-size: 1.2rem;

}

.add-cart.selected {
    background-color: #433E43;
    cursor: auto;
    pointer-events:none;
}

.add-cart.unselected {
    background-color: #363E4F;

}

.add-cart.unselected:hover{
    background-color: #36454F;
}


.add-cart.stock {
    background-color: rgba(52, 73, 94, 0.6);
    cursor: auto;
    pointer-events:none;
}

@media (max-width: 480px) {
    .info-box {
        left: 50%;
        transform: translate(-50%, 0);
        width: 60%;
        top: 7rem;
        bottom: unset;
        position: absolute;
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