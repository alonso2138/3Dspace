export default class LeftBar  {
    constructor(containerId, onParentSquareClick) {
        this.containerId = containerId;
        this.onParentSquareClick = onParentSquareClick;

        this.squareContainer = null;
        this.styleSheet = null;
        this.styleSheetMobile = null;

        // Bind the resize method to the current instance
        this.resize = this.resize.bind(this);
    }

    injectStylesComputer() {
        console.log("injecting computer styles");

        const styles = `
            .custom-container-wrapper{
                
            }

            .custom-container {
                width: auto; /* Set a thinner width */
                overflow-y: auto; /* Enable vertical scrolling if content overflows */
                display: flex;
                flex-direction: column; /* Stack items vertically */
                align-items: center; /* Center the squares horizontally */

                top: 5%;
                bottom: 5%;

                margin-left: 0px; /* Keep the container on the left side */
                border-radius: 0 10px 10px 0; /* Slightly reduce the corner radius */
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Add a nice shadow */
                padding: 10px;
                background-color: #ffffff; /* Optional: Add a background color */
                gap: 20px; /* Increase margin between squares */
                position: fixed;
            }

            .custom-square-container {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 10px; /* Increase space between title and square */

            }

            .custom-square-title {
                margin-top: 50px;
                font-size: 14px;
                text-align: center;
            }

            .custom-square {
                width: 100px; /* Make the squares larger */
                height: 100px; /* Make the squares larger */
                background-color: #ffffff;
                border-radius: 10px; /* Slightly reduce the corner radius */
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Add a nice shadow */
                transition: transform 0.3s ease; /* Smooth hover animation */
            }

            .custom-square:hover {
                transform: scale(1.1); /* Scale up on hover */
            }

            /* Custom scrollbar styles */
            .custom-container::-webkit-scrollbar {
                width: 12px;
            }

            .custom-container::-webkit-scrollbar-track {
                background: #f9f9f9;
                border-radius: 15px;
            }

            .custom-container::-webkit-scrollbar-thumb {
                background-color: #3498db;
                border-radius: 15px;
                border: 3px solid #f9f9f9;
            }

            .custom-container::-webkit-scrollbar-button {
                display: none; /* Remove the arrows */
            }

            .custom-big-title {
                font-size: 1em;
                font-weight: bold;
                text-align: center;
            }
        `;

        this.styleSheet = document.createElement('style');
        this.styleSheet.type = 'text/css';
        this.styleSheet.innerText = styles;
        document.head.appendChild(this.styleSheet);
    }
    
    injectStylesMobile() {
        console.log("injecting mobile styles");
        const styles = `
            .custom-container-wrapper{
                width: 100%;
                display: flex;
                flex-direction: row;
                justify-content: center;
            }

            .custom-container {
                max-width: 80%; /* Set the container to full width */
                widht: auto;
                height: auto; /* Set a fixed height */

                overflow-x: auto; /* Enable horizontal scrolling if content overflows */
                display: flex;
                flex-direction: column; /* Stack items horizontally */
                align-items: center; /* Center the squares vertically */

                margin-top: 10px; /* Keep the container at the top */
                border-radius: 0 0 10px 10px; /* Slightly reduce the corner radius */
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Add a nice shadow */
                background-color: #ffffff; /* Optional: Add a background color */
                position: fixed;
            }

            #parent-square-container{
                padding: 10px;
                align-items: center; /* Center the squares vertically */    
                display: flex;
                flex-direction: row;
                overflow-x: auto; /* Enable horizontal scrolling if content overflows */
                gap: 20px; /* Increase margin between squares */

            }

            .custom-square-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 10px; /* Increase space between title and square */
            }

            .custom-square-title {
                margin-top: 10px;
                font-size: 10px;
                font-weight: bold;
                text-align: center;
            }

            .custom-square {
                width: 70px; /* Make the squares larger */
                height: 70px; /* Make the squares larger */
                background-color: #ffffff;
                border-radius: 10px; /* Slightly reduce the corner radius */
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Add a nice shadow */
                transition: transform 0.3s ease; /* Smooth hover animation */
            }

            .custom-square:hover {
            transform: scale(1.1); /* Scale up on hover */
            }

            /* Custom scrollbar styles */
            .custom-container::-webkit-scrollbar {
            height: 12px;
            }

            .custom-container::-webkit-scrollbar-track {
            background: #f9f9f9;
            border-radius: 15px;
            }

            .custom-container::-webkit-scrollbar-thumb {
            background-color: #3498db;
            border-radius: 15px;
            border: 3px solid #f9f9f9;
            }

            .custom-container::-webkit-scrollbar-button {
            display: none; /* Remove the arrows */
            }

            .custom-big-title {
                font-size: 0;
            }
        `;

        this.styleSheetMobile = document.createElement('style');
        this.styleSheetMobile.type = 'text/css';
        this.styleSheetMobile.innerText = styles;
        document.head.appendChild(this.styleSheetMobile);
    }

    removeStylesComputer() {
        if(this.styleSheet && this.styleSheet.parentNode) {
            document.head.removeChild(this.styleSheet);
        }
    }

    removeStylesMobile() {
        if(this.styleSheetMobile && this.styleSheetMobile.parentNode) {
            document.head.removeChild(this.styleSheetMobile);
        }
    }

    detectMobile() {
        return window.innerWidth <= 768; // Adjust the width as needed
    }

    generateHTML() {
        const container = document.createElement('div');
        container.classList.add('custom-container');

        const containerWrapper = document.createElement('div');
        containerWrapper.classList.add('custom-container-wrapper');
        containerWrapper.appendChild(container);

        const bigTitle = document.createElement('div');
        bigTitle.classList.add('custom-big-title');
        bigTitle.textContent = 'Elementos personalizables:';

        this.squareContainer = document.createElement('div');
        this.squareContainer.id = this.containerId;

        container.appendChild(bigTitle);
        container.appendChild(this.squareContainer);
        document.body.appendChild(containerWrapper);

    }

    generateBox(object, id){
        const squareWrapper = document.createElement('div');
        squareWrapper.classList.add('custom-square-container');

        const title = document.createElement('div');
        title.classList.add('custom-square-title');
        title.textContent = object.name;

        const square = document.createElement('div');
        square.classList.add('custom-square');
        
        // Set background photo
        if(object.img){
            square.style.backgroundImage = `url(${object.img})`;
            square.style.backgroundSize = 'contain';
            square.style.backgroundPosition = 'center';
            square.style.backgroundRepeat = 'no-repeat';    
        }
                
        square.addEventListener('click', () => {
            if(this.onParentSquareClick) this.onParentSquareClick(id);
        });

        squareWrapper.appendChild(title);
        squareWrapper.appendChild(square);
        this.squareContainer.appendChild(squareWrapper);
    }

    resize(){
        if(this.detectMobile()){
            console.log("mobile");
            this.injectStylesMobile();
            this.removeStylesComputer();
        } else {
            console.log("computer");
            this.injectStylesComputer();
            this.removeStylesMobile();
        }
    }

    init() {
        this.resize();
        this.generateHTML();
    }
}
