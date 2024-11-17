import Experience from "../Main";

let instance = null;

export default class BottomBar {
    constructor(containerId, onSquareClick, onParentSquareClick, infoTabAppear,disappearBox) {
        // Singleton
        if (instance) {
            return instance;
        }
        instance = this;

        this.experience = new Experience

        this.containerId = containerId;
        this.onSquareClick = onSquareClick;
        this.onParentSquareClick = onParentSquareClick;
        this.infoTabAppear = infoTabAppear;
        this.disappearBox = disappearBox;

        this.animationTimeout=100;
        this.isAnimating = false; // Flag to track animation state

        this.styleSheet = null;
        this.styleSheetMobile = null;
    }

    checkOverflow() {
        const parentContainer = document.querySelector('.parent-container');
        if(parentContainer){
            if (parentContainer.scrollWidth > parentContainer.clientWidth) {
                parentContainer.classList.add('overflow');
            } else {
                parentContainer.classList.remove('overflow');
            }
        }

        const customContainer = document.querySelector('.custom-container');
        if(parentContainer){
            if (customContainer.scrollWidth > customContainer.clientWidth) {
                customContainer.classList.add('overflow');
            } else {
                customContainer.classList.remove('overflow');
            }
        }

    }

    // Bottom bar
    injectStylesComputer() {
        const styles = `
            .wrapper{
            width: 100%;
            height: 25%;

            display: flex;
            flex-direction: column-reverse;
            gap: 1vh;

            bottom: 5%;
            position: absolute;
            }

            .parent-container{
        
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;

                gap: 22px;

                padding: 10px;

                overflow-x: auto; /* Enable horizontal scrolling if content overflows */
                overflow-y: hidden; /* Disable vertical scrolling */

                opacity: 1;
                transition: opacity 0.3s ease; /* Smooth hover animation */
            }

            .parent-container.overflow{
                justify-content: flex-start !important;
            }

            .parent-container::-webkit-scrollbar {
                height: 0;
            }

            .parent-container::-webkit-scrollbar-track {
                background: #f9f9f9;
                border-radius: 15px;
            }

            .parent-container::-webkit-scrollbar-thumb {
                background-color: #3498db;
                border-radius: 15px;
                border: 3px solid #f9f9f9;
            }

            .parent-container::-webkit-scrollbar-button {
                display: none; /* Remove the arrows */
            }

            .parent-container:before{
                opacity: 0;
            }

            .parent-square{ 
                min-width: fit-content;
                background-color: rgba(52, 73, 94, 0.8); /* White with 90% opacity */

                text-align: center;
                vertical-align: middle; 
                line-height: 50px;
                font-size: 1.5rem;
                color: #fff;

                border-radius: 45px;
                cursor: pointer;
                padding: 1rem 4rem;

                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Add a nice shadow */
                transition: font-size 0.3s ease, background-color 0.3s ease, color 0.3s ease; /* Smooth hover animation */
                white-space: nowrap; /* Prevent text from wrapping */
                overflow: hidden; /* Hide overflow */
                text-overflow: ellipsis; /* Add ellipsis if text overflows */
            }

            .parent-square:hover{
                font-size: 1.7rem;
                background-color: rgba(52, 73, 94, 0.8); /* White with 90% opacity */
            }

            .ParentSquareSelected{
                font-size: 2rem !important;
                color: #fff !important;
                background-color: rgba(52, 73, 94, 1) !important; /* White with 90% opacity */
            }

            .custom-container{
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;

                padding: 1rem;
                gap: 30px;

                overflow-x: auto; /* Enable horizontal scrolling if content overflows */
                overflow-y: hidden; /* Disable vertical scrolling */

                opacity: 0;
                transition: opacity 0.3s ease; /* Smooth hover animation */
            }

            .custom-container.overflow{
                justify-content: flex-start !important;
            }

            .custom-container::-webkit-scrollbar {
                height: 0;
            }

            .custom-container::-webkit-scrollbar-track {
                background: #e7e7e7;
                border-radius: 15px;
            }

            .custom-container::-webkit-scrollbar-thumb {
                background-color: #3498db;
                border-radius: 15px;
            }

            .custom-container::-webkit-scrollbar-button {
                display: none; /* Remove the arrows */
            }

            .hide{
                opacity: 0;
            }

            .show{
                opacity: 1;
            }

            .custom-square{
                width: auto;
                height: auto;
                background-color: rgba(255, 255, 255, 0.8);
                border-radius: 15px;
                cursor: pointer;
                display: inline-block;

                text-align: center;
                vertical-align: middle; 
                line-height: 5vh;
                font-size: 1.6rem;
                color: #000;
                padding: 0.5rem 1.5rem;
                
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Add a nice shadow */
                transition: all 0.3s ease;                
                white-space: nowrap; /* Prevent text from wrapping */
            }

            .CustomSquareSelected{
                font-size: 2rem !important;
                background: #566F7F !important;
                color: #fff

            }

            .custom-square:hover{
                font-size: 1.8rem;
                background-color: rgba(255, 255, 255, 0.9); /* White with 90% opacity */
            }

            /*  Tablet  */
            @media (max-width: 1366px) {
                /* Parent Square */
                .parent-square{ 
                    line-height: 50px;
                    font-size: 1rem;
                    padding: 0.5rem 3rem;
                }

                .parent-square:hover{
                    font-size: 1.2rem;
                    background-color: rgba(52, 73, 94, 0.8); /* White with 90% opacity */
                }

                .ParentSquareSelected{
                    font-size: 1.4rem !important;
                }

                /* Custom Square */
                .custom-square{
                    line-height: 5vh;
                    font-size: 1rem;
                    padding: 0.3rem 1.2rem;
                }

                .custom-square:hover{
                    font-size: 1.1rem;
                    background-color: rgba(255, 255, 255, 0.9); /* White with 90% opacity */
                }

                .CustomSquareSelected{
                    font-size: 1.3rem !important;
                }
            }

            /*  Phone  */
            @media (max-width: 414px) {
                /* Parent Square */
                .parent-square{ 
                    line-height: 50px;
                    font-size: 0.9rem;
                    padding: 0.1rem 1.4rem;
                }

                .parent-square:hover{
                    font-size: 0.7rem;
                    background-color: rgba(52, 73, 94, 0.8); /* White with 90% opacity */
                }

                .ParentSquareSelected{
                    font-size: 1rem !important;
                }

                /* Custom Square */
                .custom-square{
                    line-height: 5vh;
                    font-size: 0.8rem;
                    padding: 0.1rem 1rem;
                }

                .custom-square:hover{
                    font-size: 0.9em;
                    background-color: rgba(255, 255, 255, 0.9); /* White with 90% opacity */
                }

                .CustomSquareSelected{
                    font-size: 1rem !important;
                }
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.type = 'text/css';
        styleSheet.innerText = styles;
        document.head.appendChild(styleSheet);
    }

    // Bottom Bar
    injectStylesMobile() {
        const styles = `

        `;
        this.styleSheetMobile = document.createElement('style');
        this.styleSheetMobile.type = 'text/css';
        this.styleSheetMobile.innerText = styles;
        document.head.appendChild(this.styleSheetMobile);
    }

    generateHTML() {
        const wrapper = document.createElement('div');
        wrapper.classList.add('wrapper');

        // Parent  bar
        const ParentContainer = document.createElement('div');
        ParentContainer.id = "ParentContainer";
        ParentContainer.classList.add('parent-container');
        wrapper.appendChild(ParentContainer);

        // Customs bar
        const CustomContainer = document.createElement('div');
        CustomContainer.id = "CustomContainer";
        CustomContainer.classList.add('custom-container');
        wrapper.appendChild(CustomContainer);

        document.body.appendChild(wrapper);

    }

    generateCustom(object, id) {
        const square = document.createElement('div');
        square.textContent = object.name;
        square.id = "ParentSquare"+id
        square.classList.add('parent-square');

        square.addEventListener('click', () => {
            //object.selected = id;
            if (this.onParentSquareClick) this.onParentSquareClick(id);
        });

        document.getElementById("ParentContainer").appendChild(square);
    }

    destroyBottomBar() {
        // Delete wrapper element
        const wrapper = document.querySelector('.wrapper');
        if (wrapper) {
            wrapper.remove();
        }
    }

    generateBottomBar(customs, i) {
        if (this.isAnimating) return; // Ignore if an animation is in progress

        for (let y = 0; y < customs[i].id.length; y++) {
            const square = document.createElement('div');
            square.textContent = customs[i].title[y];
            square.classList.add('custom-square');
            if(customs[i].selected == y) square.classList.add('CustomSquareSelected');
            //console.log("El custom seleccionado es: "+this.experience.moto.customs[i].selected,i)
            square.id = 'CustomSquare'+customs[i].id[y]+'Pieza'+i;

            // Set background photo
            if(customs[i].image[y]){
                square.style.backgroundImage = `url(${customs[i].image[y]})`;
            }

            document.addEventListener('mousedown', () => {
                if (this.infoTabAppear && !this.experience.infoTab.mouseOverInfoTab) this.disappearBox(y);
            });
            
            square.addEventListener('click', () => {
                //  customs[i].selected = y;
                if (this.infoTabAppear) this.infoTabAppear(y);
                if (this.onSquareClick) this.onSquareClick(y);
            });
            
            document.getElementById("CustomContainer").appendChild(square);

            document.getElementById("CustomContainer").classList.remove('hide');
            document.getElementById("CustomContainer").classList.add('show');
        }

        this.checkOverflow();
        this.experience.infoTab.appearBox(customs[i],this.experience.moto.customs[i].selected);
    }

    deleteBottomBar() {
        if (this.isAnimating) return; // Ignore if an animation is in progress

        this.isAnimating = true; // Set the flag to indicate an animation is in progress
    
        document.getElementById("CustomContainer").classList.add('hide');
        document.getElementById("CustomContainer").classList.remove('show');

        setTimeout(() => {
            const squareContainers = document.getElementById("CustomContainer").querySelectorAll("div");
            squareContainers.forEach((container) => {
                container.remove();
            });

            this.isAnimating = false; // Reset the flag after the animation completes

        }, this.animationTimeout); // Match the duration of the CSS transition (1s)
    }
    
    resize() {
        this.checkOverflow();

    }

    init() {
        this.injectStylesComputer();
        this.generateHTML();
    }
}