import Experience from "../Main";
import { loadStripe } from '@stripe/stripe-js';

export default class RightBar {
    constructor() {
        this.experience = new Experience;

        this.isOpen = false; // Track if the right bar is open or closed

        this.selectedPieces = [];

        this.initStripe();
        this.generateTopNav();
        this.generateHTML();
        this.injectStyles();

        // Initialize the cart overlay
        this.initCartOverlay();
    }

    async initStripe() {
        this.stripe = await loadStripe('pk_test_51JprSpH6YrdtkYECv08fbADGEaVlrZM5wCQdmVS9Gu498mSTXPt8x8xQpSCx349trfkW8Lu1sYh2CfHkyUXXY7Zh00uJEkEAW8');
    }

    async handlePayment() {
        if (!this.stripe) {
            console.error('Stripe has not been initialized.');
            return;
        }

        // Fill cart with selected pieces
        const lineItems = [];
        for (let i = 0; i < this.selectedPieces.length; i++) {
            lineItems.push({ price: this.selectedPieces[i].price_id, quantity: 1 });
        }

        // Use environment variable for API endpoint
        const apiEndpoint = 'https://tunerr-17802672a424.herokuapp.com' 
        //|| 'http://localhost:3000';

        try {
            const response = await fetch(`${apiEndpoint}/create-checkout-session`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(lineItems)
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const session = await response.json();

            const { error } = await this.stripe.redirectToCheckout({
                sessionId: session.id,
            });

            if (error) {
                console.error('Error:', error);
            }
        } catch (error) {
            console.error('Fetch error:', error);
        }
    }

    toggleRightBar() {
        // Notification
        document.getElementById('notification').style.display = 'none';

        this.isOpen = !this.isOpen;
        const overlay = document.getElementById('cart-overlay');

        if (this.isOpen) {
            overlay.style.pointerEvents = "auto";
            overlay.style.opacity = 1;
        } else {
            overlay.style.opacity = 0;
            overlay.style.pointerEvents = "none";
        }
    }

    calculateTotal() {
        let total = 0;
        this.selectedPieces.forEach(piece => {
            total += piece.price;
        });
        
        return total.toFixed(2);
    }

    deleteRightBar() {
        const content = document.querySelector('.content');
        const overlay = document.getElementById('cart-overlay');
        const topnav = document.querySelector('.top-nav-wrapper');
        content.remove();
        overlay.remove();
        topnav.remove();
    }

    initCartOverlay() {
        const toggleCartButton = document.getElementById('toggle-cart');
        const closeCartButton = document.getElementById('close-cart');

        // Update the cart content
        this.updateList();

        // Add event listeners
        toggleCartButton.onclick = () => this.toggleRightBar();
        closeCartButton.onclick = () => this.toggleRightBar();
    }

    generateTopNav(){
        // Create top-nav div
        const topNav = document.createElement('div');
        topNav.className = 'top-nav';

        // Create top-nav wrapper
        const topNavWrapper = document.createElement('div');
        topNavWrapper.className = 'top-nav-wrapper';
        topNavWrapper.appendChild(topNav);

        // Create back button
        const backButton = document.createElement('button');
        backButton.className = 'back-button1';
        backButton.innerHTML = '←';
        backButton.addEventListener('click', () => {
            this.experience.restartExperience();
        });
        topNav.appendChild(backButton);

        // Create title div
        const title = document.createElement('div');
        title.className = 'title';
        title.textContent = this.experience.moto.model;
        topNav.appendChild(title);

        // Create cost-box div
        const costBox = document.createElement('div');
        costBox.className = 'cost-box';

        // Create total div
        const totalDiv = document.createElement('div');
        totalDiv.className = 'TotalDiv';
        totalDiv.innerHTML = 'Total: <span id="Total" class="font-bold">0.00 €</span>';
        costBox.appendChild(totalDiv);

        // Create toggle-cart button
        const toggleCartButton = document.createElement('button');
        toggleCartButton.id = 'toggle-cart';
        toggleCartButton.innerHTML = '🛒 Personalizaciones';

        // Create notification
        const cartNotification = document.createElement('div');
        cartNotification.id = 'notification';

        toggleCartButton.appendChild(cartNotification);
        costBox.appendChild(toggleCartButton);

        topNav.appendChild(costBox);

        // Create flex container
        const flexContainer = document.createElement('div');
        flexContainer.className = 'items-right';

        // Create country flag image
        const flagImage = document.createElement('img');
        flagImage.src = 'https://placehold.co/20x15';
        flagImage.alt = 'Country flag';

        // Get country code from the URL
        async function getCountryCode() {
            try {
                const response = await fetch('https://ipapi.co/json/');
                const data = await response.json();
                return data.country_code.toLowerCase(); // Returns the country code in lowercase
            } catch (error) {
                console.error('Error fetching country code:', error);
                return null;
            }
        }

        async function setFlagImage() {
            const countryCode = await getCountryCode();
            switch (countryCode) {
                case 'es':
                    flagImage.src = 'https://upload.wikimedia.org/wikipedia/en/9/9a/Flag_of_Spain.svg';
                    break;
                case 'fr':
                    flagImage.src = 'https://upload.wikimedia.org/wikipedia/en/c/c3/Flag_of_France.svg';
                    break;
                case 'it':
                    flagImage.src = 'https://upload.wikimedia.org/wikipedia/en/0/03/Flag_of_Italy.svg';
                    break;
                case 'ad':
                    flagImage.src = 'https://upload.wikimedia.org/wikipedia/commons/1/19/Flag_of_Andorra.svg';
                    break;
                default:
                    flagImage.src = 'https://upload.wikimedia.org/wikipedia/en/9/9a/Flag_of_Spain.svg';
                    break;
            }
        }

        // Call the function to set the flag image
        setFlagImage();

        flagImage.className = 'mr-2';
        flexContainer.appendChild(flagImage);

        // Create user button
        const userButton = document.createElement('button');
        userButton.className = 'user-button';
        userButton.innerHTML = '<i class="fas fa-user"></i>';
        //flexContainer.appendChild(userButton);

        topNav.appendChild(flexContainer);
        document.body.appendChild(topNavWrapper);
    }

    generateHTML() {

        //Confirmation Box 
        // Create the overlay
        const confirmationOverlay = document.createElement('div');
        confirmationOverlay.className = 'confirmation-overlay';

        // Create the confirmation box
        const confirmationBox = document.createElement('div');
        confirmationBox.className = 'confirmation-box';

        // Create the confirmation message
        const confirmationMessage = document.createElement('p');
        confirmationBox.appendChild(confirmationMessage);

        // Create the cancel button
        const cancelButton = document.createElement('button');
        cancelButton.className = 'cancel-button';
        cancelButton.textContent = 'Cancelar';
        confirmationBox.appendChild(cancelButton);

        // Create the confirm button
        const confirmButton = document.createElement('button');
        confirmButton.className = 'confirm-button';
        confirmButton.textContent = 'Confirmar';
        confirmationBox.appendChild(confirmButton);

        // Append the confirmation box to the overlay
        confirmationOverlay.appendChild(confirmationBox);

        // Append the overlay to the body
        document.body.appendChild(confirmationOverlay);

        // Add event listeners for the confirmation and cancel buttons
        confirmButton.addEventListener('click', () => {
            //custom.selected = id;
            //this.updateList();
            //document.body.removeChild(confirmationOverlay);
        });

        cancelButton.addEventListener('click', () => {
            document.querySelector('.confirmation-overlay').style.opacity = 0;
            document.querySelector('.confirmation-overlay').style.pointerEvents = 'none';
        });

        // Create content div
        const content = document.createElement('div');
        content.className = 'content';

        // Create overlay div
        const overlay = document.createElement('div');
        overlay.className = 'overlay';
        overlay.id = 'cart-overlay';

        // Create box div
        const box = document.createElement('div');
        box.className = 'box';
        box.id = 'cart-box';

        // Create box title
        const boxTitle = document.createElement('h2');
        boxTitle.textContent = 'Personalizaciones'; 
        box.appendChild(boxTitle);

        // Create list
        const list = document.createElement('ul');
        const items = [
            'Tipo de vehículo: Arrow - 460.73 €',
            'Pliegos: Color negro mate - 447.23 €',
            'Protecciones: Topes anticipados negros - 127.17 €'
        ];
        items.forEach(itemText => {
            const listItem = document.createElement('li');
            listItem.textContent = itemText;
            list.appendChild(listItem);
        });
        box.appendChild(list);

        // Create total div
        const boxTotal = document.createElement('div');
        boxTotal.className = 'total';
        boxTotal.textContent = 'Total:';
        box.appendChild(boxTotal);

        // Create back button
        const backButtonBox = document.createElement('div');
        backButtonBox.className = 'back';
        backButtonBox.id = 'close-cart';
        backButtonBox.textContent = 'Volver atrás';

        box.appendChild(backButtonBox);

        // Create checkout div
        const checkout = document.createElement('div');
        checkout.className = 'checkout';
        checkout.textContent = 'Checkout';
        box.appendChild(checkout);
        checkout.addEventListener('click', this.handlePayment.bind(this));

        // Create payment methods div
        const paymentMethods = document.createElement('div');
        paymentMethods.className = 'payment-methods';
        const paymentImages = [
            'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/800px-Mastercard-logo.svg.png',
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWxYUQvdwKXZ9meVu4Jx6fr7nNNo99TLl-bA&s',
            'https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg'
        ];
        paymentImages.forEach(src => {
            const img = document.createElement('img');
            img.src = src;
            img.alt = 'Payment method';
            paymentMethods.appendChild(img);
        });
        box.appendChild(paymentMethods);

        overlay.appendChild(box);

        // Append all elements to the body
        document.body.appendChild(content);
        document.body.appendChild(overlay);
    }

    injectStyles() {
        const styles=
        `
        body {
            transition: filter 0.5s ease;

        }


        #notification{
            opacity:1;

            position: fixed;
            height: 1rem;
            width: 1rem;
            border-radius: 50%;
            background-color: #ff0000; /* Example variable */
            top:0;
            right:0;
            //transform: translate(580%, -100%);

            transition: all 0.5s ease;
        }

        .top-nav-wrapper {
            position: fixed;
            z-index: 2;
            top: 5%;
            left: 0;
            right: 0;
            display:flex;
            background-color: rgba(0,0,0,0);
            height: 6rem;
            justify-content: center;
            text-align:center;
            width: 100%;
            align-items: center;
            display: flex;
            flex-wrap: wrap;
        }

        .top-nav {
            background-color: var(--Topnav);
            max-width: 60rem;
            height: 100%;
            width: 100%;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            justify-content: space-around;
            border-radius: 4rem;
            display: flex;
            align-items: center;

        }
        .top-nav button, .top-nav img, .top-nav .logo {
            color: var(--Text);
        }
        .top-nav .logo {
            font-size: 1.5rem;
            font-weight: bold;
        }
        .content {
            z-index: 2;
            opacity: 1;

            margin-top: 4rem;
            position: relative;
        }
        .title {
            height: 100%;
            text-align: center;
            color: var(--Text);
            text-decoration: underline;
            font-size: 1.5rem;
            font-weight: bold;
            display: flex;
            align-items: center;
        }

        #Total {
            font-weight: bold;
        }

        .cost-box {
            display:flex;
            flex-direction: column;
            justify-content: center;
            width: auto;
            height: 100%;
            padding: 0 1rem;
            color: var(--Text);
            text-align: center;
            bottom: 0;
            transition: width 0.3s ease;
        }
        .cost-box button {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-top: 0.5rem;
            color: var(--Text);
            font-size: 1rem;
            cursor: pointer;
            padding: 0.5rem 1rem;
            border:none;
            border-radius: 0.5rem;
            
            background-color: var(--Button);

            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

            transition: all 0.3s ease;
        }
        .cost-box button:hover {
            background-color: var(--ButtonHover);
            color: var(--TextHighlight);
            box-shadow: 0 6px 8px rgba(0, 0, 0, 0.2);
        }
        .cost-box button i {
            margin-right: 0.5rem;
            transition: transform 0.3s ease;
        }
        .cost-box button:hover i {
            transform: scale(1.2);
        }

        .back-button1 {
            margin-left: 1rem;
            font-size: 2rem;
            cursor: pointer;
            color: var(--Text);
            background-color: rgba(255, 255, 255, 0);
            border: none;
            text-decoration: none;

            transition: all 0.3s ease;
        }

        .back-button1:hover{
            transform: scale(1.1);
        }


        .items-right{
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 1rem;
        }

        .user-button {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background-color: var(--ButtonSelected);
            background-image: url('https://upload.wikimedia.org/wikipedia/commons/7/7e/Circle-icons-profile.svg'); /* Example user icon */
            background-size: cover;
            background-position: center;
            color: var(--Text);
            cursor: pointer;
            transition: background-color 0.3s ease, transform 0.3s ease;
        }

        .user-button:hover {
            background-color: var(--ButtonHover);
            transform: scale(1.1);
        }

        .mr-2 {
            width: 2rem;
            height: 2rem;
            object-fit: cover;
            border: 1px solid var(--Text);
            border-radius: 5rem; /* Adjust the percentage to get the desired roundness */
            overflow: hidden; /* Ensure the border follows the shape of the image */
        }

        .overlay {
            opacity: 0;
            pointer-events: none;

            position: fixed;
        
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            display: flex;


            background: rgba(255, 255, 255, 0.8);
            backdrop-filter: blur(5px);
            z-index: 100;
            justify-content: center;
            align-items: center;

            transition: opacity 0.3s ease;
        }
        .overlay .box {
            background-color: var(--InfoBoxBackground);
            padding: 2rem;
            border-radius: 0.5rem;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            text-align: center; 
            left:5%;
            right:5%;


        }
        .overlay .box h2 {
            font-size: 1.5rem;
            font-weight: bold;
            margin-bottom: 1rem;
        }
        .overlay .box ul {
            text-align: left;
            margin-bottom: 1rem;
        }
        .overlay .box ul li {
            margin-bottom: 0.5rem;
        }
        .overlay .box .total {
            font-weight: bold;
            margin-bottom: 1rem;
        }
        .overlay .box .checkout {
            background-color: var(--ButtonSelected);
            color: var(--Text);
            padding: 0.5rem 1rem;
            border-radius: 0.5rem;
            cursor: pointer;
            margin-bottom: 1rem;
            transition: background-color 0.3s ease;
        }
        .overlay .box .checkout:hover {
            background-color: var(--ButtonHover);
        }
        .overlay .box .back {
            color: var(--Text);
            cursor: pointer;
            margin-bottom: 1rem;
            transition: text-decoration 0.3s ease;
        }
        .overlay .box .back:hover {
            text-decoration: underline;
        }
        .overlay .box .payment-methods img {
            margin: 0 0.5rem;
            padding: 0.5rem;
            width: 3rem;
            height: 1.5rem;
            object-fit: contain;
            border-radius: 0.5rem;
            border: 1px solid var(--Text);
            opacity: 1;

            transition: all 0.3s ease;
        }

        .overlay .box .payment-methods img:hover{
            opacity: 0.5;
        }

        .confirmation-overlay {
        font-weight: 700;
        opacity: 0;
            pointer-events:none;
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(255, 255, 255, 0.8);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 200;
                }
                .confirmation-box {
                margin: 0 5%;
                opacity:1;
                background: var(--InfoBoxBackground);
                padding: 2rem;
                border-radius: 0.5rem;
                text-align: center;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                }
                .confirmation-box p {
                margin-bottom: 1rem;
                }
                .cancel-button {
                background: var(--CustomHover);
                color: var(--Text);
                border: none;
                padding: 0.5rem 1rem;
                border-radius: 0.5rem;
                cursor: pointer;
                margin-right: 1rem;
                transition: background-color 0.3s ease;
                    box-shadow: 2.3px 4.6px 4.6px hsl(0deg 0% 0% / 0.43);

                }
                .cancel-button:hover {

                background: #edddd9;
                }
                .confirm-button {
                background: #e9edd9;
                    box-shadow: 2.3px 4.6px 4.6px hsl(0deg 0% 0% / 0.43);

                color: var(--Text);
                border: none;
                padding: 0.5rem 1rem;
                border-radius: 0.5rem;
                cursor: pointer;
                transition: background-color 0.3s ease;
                }
                .confirm-button:hover {
                background: var(--ParentHover);
        }

        @media (max-width: 768px) {
            .content {
                text-align: center;
            }
            .title {
                margin-bottom: 0;
                display:none;
            }
            .cost-box {
                width: 50%;
            }

            .top-nav{
                margin: 0 20px;
            }

            .top-nav-wrapper{
                height: 4rem;
            }

            #Total{
                display:none;
            }

            .TotalDiv{
                display:none;
            }

            .cost-box button{
                font: 1.5rem;
                text-align:center;
            }         
                
            #notification {
                transform: translate(0%, -100%);
            }

        }
        `

        const styleSheet = document.createElement('style');
        styleSheet.type = 'text/css';
        styleSheet.innerText = styles;
        document.head.appendChild(styleSheet);
    }

    resize(){
        const totalElement1 = document.getElementById('toggle-cart');
        const gilipoya = '<div id="notification"></div>';

        if(window.innerWidth<768){
            totalElement1.innerHTML = ' 🛒 '+gilipoya;
        }else{
            
            totalElement1.innerHTML = '🛒 Personalizaciones'+gilipoya;
        }

    }    

    updateList() {
        const overlay = document.getElementById('cart-overlay');
        const totalElement1 = overlay.querySelector('.total');
        const totalElement2 = document.getElementById('Total');

        const piecesList = overlay.querySelector('ul');

        for(let i = -1; i < this.selectedPieces.length; i++){
            //this.selectedPieces.splice(i, 1);
        }   

        for(let i = 0; i < this.experience.moto.customs.length; i++){
            //const selected = this.experience.moto.customs[i].selected;       

           //console.log(i, selected);
            //this.selectedPieces.push({ name: this.experience.moto.customs[i].title[selected], price: this.experience.moto.customs[i].price[selected], price_id: this.experience.moto.customs[i].price_id[selected] });
        }

        //console.log(this.selectedPieces);


        // Clear the current list
        piecesList.innerHTML = '';

        // Add the selected pieces to the list
        this.selectedPieces.forEach(piece => {
            const listItem = document.createElement('li');
            listItem.textContent = `${piece.name} - ${piece.price.toFixed(2)} €`;
            piecesList.appendChild(listItem);
        });

        // Update the total price
        totalElement1.textContent = `Total: ${this.calculateTotal()} €`;
        totalElement2.textContent = `${this.calculateTotal()} €`;

    }

    addToCart(custom,id){
        //Notification
        document.getElementById('notification').style.opacity = 0;

        //Delete existing piece in cart
        const index = this.selectedPieces.findIndex(piece => piece.piezaEditando === this.experience.piezaEditando);
        if (index !== -1) {
            this.selectedPieces.splice(index, 1);
        }

        this.selectedPieces.push({ id:id, piezaEditando: this.experience.piezaEditando, name: custom.title[id], price: custom.price[id], price_id: custom.price_id[id] });
        
        this.updateList();
        this.experience.moto.customs[this.experience.piezaEditando].selected = id;
        this.experience.infoTab.appearBox(custom,id);

        this.experience.updateCookie();
    }

    removeFromCart(custom,id){
        //Find piece in cart
        const index = this.selectedPieces.findIndex(piece => piece.name === custom.title[id]);
        if (index !== -1) {
            this.selectedPieces.splice(index, 1);
        }

        this.experience.moto.customs[this.experience.piezaEditando].selected = 0;
        this.updateList();
        this.experience.infoTab.appearBox(custom,id);

        //Notification
        if(this.selectedPieces.length>0) document.getElementById('notification').style.opacity = 0;

        this.experience.updateCookie();
    }

    cartButton(custom,id){
        //Verificar si existía un custom seleccionado

        function messageBox(message, confirmation){
            let overlay = document.querySelector('.confirmation-overlay');
            overlay.style.opacity = 1;
            overlay.style.pointerEvents = 'all';
            overlay.querySelector('p').textContent = message;

            let confirmButton = overlay.querySelector('.confirm-button');

            // Remove all existing click event listeners
            const newConfirmButton = confirmButton.cloneNode(true);
            confirmButton.replaceWith(newConfirmButton);
            confirmButton=newConfirmButton;

            // Define and add the new event handler
            confirmButton.addEventListener('click', () => {
                overlay.style.opacity = 0;
                overlay.style.pointerEvents = 'none';
                if(confirmation) confirmation();
            });

        }

        if(id === custom.selected){
            messageBox(`Quieres quitar ${custom.title[id]}?`, ()=>{
                this.removeFromCart(custom,id)
                this.experience.modelLoader.loadModel(custom,this.experience.piezaEditando,custom.selected)
            });

        }else if(custom.selected!=undefined){
            messageBox(`Quieres reemplazar el ${custom.title[custom.selected]} por ${custom.title[id]}?`, ()=>{
                this.removeFromCart(custom,custom.selected)
                this.addToCart(custom,id)
                
            });

        }else{
            messageBox(`Quieres añadir ${custom.title[id]}?`, ()=>{
                this.addToCart(custom,id)
                
            });
        }


        const overlay = document.getElementById('cart-overlay');
        const totalElement1 = overlay.querySelector('.total');
        const totalElement2 = document.getElementById('Total');

        const piecesList = overlay.querySelector('ul');

        //this.selectedPieces.push({ name: custom.title[id], price: custom.price[id], price_id: custom.price_id[id] });
        
        // Clear the current list
        piecesList.innerHTML = '';

        // Add the selected pieces to the list
        this.selectedPieces.forEach(piece => {
            const listItem = document.createElement('li');
            listItem.textContent = `${piece.name} - ${piece.price.toFixed(2)} €`;
            piecesList.appendChild(listItem);
        });

        // Update the total price
        totalElement1.textContent = `Total: ${this.calculateTotal()} €`;
        totalElement2.textContent = `${this.calculateTotal()} €`;
    }
}