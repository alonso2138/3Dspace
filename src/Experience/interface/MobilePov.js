import Experience from "../Main";
export default class MobilePov{
    constructor(){
        this.experience = new Experience();
        this.mobilePovStyles();

        this.anterior;
        this.seleccionado;

        this.puntos = [];
    }

    removeSelection(){
        if(this.seleccionado!=undefined){
            if(this.puntos[this.seleccionado]){
                this.puntos[this.seleccionado].classList.remove('selected');
            }
        }
    }

    startMobilePov(){
        const wrapper = document.createElement('div');
        wrapper.className="puntosWrapper";
        for(let i = 0; i < this.experience.moto.povs.length;i++){
            const punto = document.createElement('div');
            punto.className = 'punto';
            punto.innerText = i+1;
            punto.onclick = () => {
                this.experience.stopEditing();
                this.anterior=this.seleccionado;
                this.seleccionado = i;

                if(this.seleccionado!=undefined){
                    if(this.puntos[this.seleccionado]){
                        this.puntos[this.seleccionado].classList.add('selected');
                    }
                }

                if(this.anterior!=undefined){
                    if(this.puntos[this.anterior]) {
                        this.puntos[this.anterior].classList.remove('selected');
                    }
                }

                this.experience.sceneSetup.moveCamera(null, this.experience.moto.povs[i]);
            };
            wrapper.appendChild(punto)

            this.puntos.push(punto)
        }
        document.body.appendChild(wrapper);
    }

    endMobilePov(){ 
        for(let i = 0; i < this.puntos.length;i++){
            if(this.puntos[i].parentNode) this.puntos[i].parentNode.removeChild(this.puntos[i]);
        }
        this.puntos = []; // Clear the array after removing elements
    }

    mobilePovStyles(){
        const styles = `


        .puntosWrapper{
            display:flex;
            flex-direction: column;
            gap: 1vh;
            position: absolute;

            top: 50%;
            left: 5%;
            transform: translate(0%, -50%);
        }


        .punto{
            width: 2.5rem;
            height: 2.5rem;
            background-color: var(--Parent);
            opacity: 0.9;   
            color: var(--Text);
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 50%;
            cursor: pointer;

            transition: all 0.3s ease;
        }
        
        .punto.selected {
            background-color: var(--ButtonSelected); /* Use the correct variable */
        }

        `;
        const styleSheet = document.createElement('style');
        styleSheet.type = 'text/css';
        styleSheet.innerText = styles;
        document.head.appendChild(styleSheet);
    }
}