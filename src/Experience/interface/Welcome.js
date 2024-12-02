export default class Welcome {
    constructor() {
        this.overlay = null;
        this.init();
    }

    init() {
        // Check for the welcome cookie
        const welcomeCookie = this.getCookie('welcome');
        if (welcomeCookie) {
            //this.startWelcome();
            console.log("cookie")
            this.endWelcome();
        } else {
            this.startWelcome();
        }
    }

    startWelcome() {
        // Hide interface
        console.log("start")
        this.setInterfaceOpacity(0,'none');
        if(document.querySelector('.welcome-overlay')) document.querySelector('.welcome-overlay').parentElement.removeChild(document.querySelector('.welcome-overlay'))
            
            

        // Create overlay
        this.overlay = document.createElement('div');
        this.overlay.className = 'welcome-overlay';
        this.overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.7);
            color: white;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            opacity: 0;
            pointer-events: none;
            transition: all 1s ease;
            user-select: none;
        `;

        // Create welcome texts
        const texts = [
            "¡Bienvenido a Your Essential Reality!",
            "Toca la pantalla para mirar alrededor 👆",
            "Pulsa los botones para personalizar los muebles 🖲️",
            "Pulsa para continuar"
        ];

        texts.forEach((text, index) => {
            const textElement = document.createElement('div');
            textElement.className = `welcome-text welcome-text-${index + 1}`;
            textElement.style.cssText = `
                opacity: 0;
                transition: opacity 1s ease;
                font-size: ${index === 0 ? '2rem' : '1.5rem'};
                margin: 1rem 0;
            `;
            textElement.textContent = text;
            this.overlay.appendChild(textElement);
        });

        document.body.appendChild(this.overlay);

        // Show overlay
        setTimeout(() => {
            this.overlay.style.opacity = 1;
        }, 0);

        // Show texts with delay
        texts.forEach((_, index) => {
            setTimeout(() => {
            console.log(index)
                this.overlay.querySelector(`.welcome-text-${index + 1}`).style.opacity = 1;
                if(index==texts.length-1){
                    console.log("ahora")
                    setTimeout(() => {
                        this.overlay.style.cursor = 'pointer'
                        this.overlay.style.pointerEvents = 'auto';
                        this.overlay.addEventListener('click', this.endWelcome.bind(this));
                    }, 500);
                }
            }, (index + 1) * 2000);
        });

    }

    setInterfaceOpacity(opacity,pe) {
        if(document.querySelector('.top-nav-wrapper')) document.querySelector('.top-nav-wrapper').style.opacity = opacity;
        if(document.querySelector('.top-nav-wrapper')) document.querySelector('.top-nav-wrapper').style.pointerEvents = pe;
        if(document.querySelector('.wrapper')) document.querySelector('.wrapper').style.opacity = opacity;
        if(document.querySelector('.wrapper')) document.querySelector('.wrapper').style.pointerEvents = pe;
        if(document.querySelector('.puntosWrapper')) document.querySelector('.puntosWrapper').style.opacity = opacity;
        if(document.querySelector('.puntosWrapper')) document.querySelector('.puntosWrapper').style.pointerEvents = pe;
        if(document.querySelector('.webgl')) document.querySelector('.webgl').style.pointerEvents = pe;
    }

    endWelcome() {
        this.setCookie('welcome', 'true', 15);
        if (this.overlay) {
            this.overlay.style.opacity = 0;

            setTimeout(() => {
                if (this.overlay && this.overlay.parentNode) {
                    this.overlay.parentNode.removeChild(this.overlay);
                }
                this.overlay = null;

                this.setInterfaceOpacity(1,'auto');
            }, 1000);
        }
    }

    getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    setCookie(name, value, days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = `expires=${date.toUTCString()}`;
        document.cookie = `${name}=${value};${expires};path=/`;
    }
}