import Time from './Time.js';
import SceneSetup from './SceneSetup.js';
import ModelLoader from './ModelLoader.js';
import Resources from './Resources.js';
import LoadingBar from './interface/LoadingBar.js';
import LoadColors from './interface/LoadColors.js';
import LoadMarcas from './Model/LoadMarcas.js';
import Welcome from './interface/Welcome.js';
import emailjs from '@emailjs/browser'

let instance = null;
 
export default class Experience {
    constructor(_canvas) {
        // Singleton
        if (instance) {
            return instance;
        }
        instance = this;

                //Código para mail
        // Preloader: se oculta al cargar la página
      window.addEventListener('load', function () {
        const preloader = document.getElementById('preloader');
        preloader.classList.add('fade-out');
        setTimeout(() => {
          preloader.style.display = 'none';
        }, 1000);
      });
  
      // Menú mobile: toggle de navegación
      const menuToggle = document.querySelector('.menu-toggle');
      const navLinks = document.querySelector('.nav-links');
      menuToggle.addEventListener('click', function () {
        navLinks.classList.toggle('active');
        menuToggle.classList.toggle('active');
      });
  
      // Scroll suave para enlaces de ancla
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
          e.preventDefault();
          document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
          });
        });
      });
  
      // Animación de aparición en scroll (usando Intersection Observer)
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });
  
      document.querySelectorAll('.hero-content, .container').forEach(el => {
        observer.observe(el);
      });
  
    // Manejo del formulario de contacto
    document.getElementById('contact-form').addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Aquí iría la lógica de envío (fetch/ajax)
      (function() {
        emailjs.init("MgXUjPSRjA6ntcYny"); // Reemplaza con tu ID de usuario de EmailJS
      })();
  
      // Obtener los datos del formulario
      const nombre = this.querySelector('input[type="text"]').value;
      const email = this.querySelector('input[type="email"]').value;
      const mensaje = this.querySelector('textarea').value;
      
      // Feedback visual al usuario
      const btn = this.querySelector('button');
      const originalText = btn.textContent;
      btn.textContent = "Enviando...";
      btn.disabled = true;
      
      // Mostrar indicador de carga
      const loadingIndicator = document.createElement('div');
      loadingIndicator.className = 'loading-indicator';
      loadingIndicator.innerHTML = `
        <div class="spinner" style="border: 3px solid #f3f3f3; border-top: 3px solid #d4af37; 
        border-radius: 50%; width: 30px; height: 30px; margin: 10px auto; 
        animation: spin 1s linear infinite;"></div>
        <p>Enviando mensaje...</p>
      `;
      this.appendChild(loadingIndicator);
      
      // Crear estilos para la animación
      if (!document.getElementById('spinner-style')) {
        const style = document.createElement('style');
        style.id = 'spinner-style';
        style.textContent = `
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `;
        document.head.appendChild(style);
      }
      
      // Preparar datos para EmailJS
      const templateParams = {
        from_name: nombre,
        from_email: email,
        message: mensaje
      };
      
      // Enviar email usando EmailJS
      emailjs.send('service_vgqyf1o', 'template_48cdfgr', templateParams)
        .then(function(response) {
          console.log('SUCCESS!', response.status, response.text);
          
          // Mostrar mensaje de éxito
          showSuccessMessage(e.target);
        }, function(error) {
          console.log('FAILED...', error);
          
          // Mostrar mensaje de error
          showErrorMessage(e.target, btn, originalText);
        });
    });
  
    // Función para mostrar mensaje de éxito
    function showSuccessMessage(form) {
      form.innerHTML = `
        <div style="text-align: center; padding: 20px; animation: fadeIn 0.5s ease;">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#d4af37" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          <h3>¡Mensaje enviado con éxito!</h3>
          <p>Nos pondremos en contacto contigo pronto.</p>
        </div>
      `;
      
      // Añadir estilo para la animación de entrada
      if (!document.getElementById('fadeIn-style')) {
        const style = document.createElement('style');
        style.id = 'fadeIn-style';
        style.textContent = `
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `;
        document.head.appendChild(style);
      }
    }
  
    // Función para mostrar mensaje de error
    function showErrorMessage(form, btn, originalText) {
    // Eliminar indicador de carga
    const loadingIndicator = form.querySelector('.loading-indicator');
    if (loadingIndicator) form.removeChild(loadingIndicator);
    
    // Restaurar botón
    btn.textContent = originalText;
    btn.disabled = false;
    
    // Mostrar mensaje de error
    const errorMsg = document.createElement('div');
    errorMsg.className = 'error-message';
    errorMsg.innerHTML = `
      <p style="color: #e74c3c; margin: 10px 0; text-align: center; animation: shake 0.5s ease;">
        Hubo un problema al enviar tu mensaje. Por favor, inténtalo de nuevo o contáctanos directamente.
      </p>
    `;
    form.insertBefore(errorMsg, btn);
    
    // Añadir estilo para la animación shake
    if (!document.getElementById('shake-style')) {
      const style = document.createElement('style');
      style.id = 'shake-style';
      style.textContent = `
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
      `;
      document.head.appendChild(style);
    }
    
    // Eliminar el mensaje después de 5 segundos
    setTimeout(() => {
      if (form.contains(errorMsg)) {
        form.removeChild(errorMsg);
      }
    }, 5000);
  }      

        
        // Global access
        window.experience = this;
        window.addEventListener( 'resize', this.resizeEvent.bind(this),false);
        this.canvas = _canvas;

        // Initialize this.stats
        //this.stats = new Stats();
        //this.stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
        //document.body.appendChild(this.stats.dom);

        // Initialize LoadMarcas
        this.preInit();
    }

    async preInit(){
        // Carcar marcas
        this.loadMarcas = new LoadMarcas();
        await this.loadMarcas.init();
        
        // Load colors
        this.loadColors = new LoadColors();

        this.init();
    }

    async init(){
        this.startFunction('/datos/3.json');
            
    }

    startFunction(path){
        this.loadMotoData(path).then(() => 
            {

                // Start loading resources once the object data is loaded
                this.resources = new Resources();

                // Set up loading bar
                this.loadingBar = new LoadingBar();

                // Finally load the scene when all the resources are loaded
                this.resources.on('ready', () => {
                    this.initScene();
                });
            });
    }

    // Function to load JSON data
    async loadMotoData(path) {
        const match = path.match(/\/datos\/(\d+)\.json/);
        this.path = match ? match[1] : null;

        try {
            const response = await fetch(path);
            const jsonData = await response.json();

            this.moto = jsonData;
/*
            // Instantiate this with data from JSON
            this.moto = {
                id: jsonData.id,
                sky: jsonData.sky,
                tipo: jsonData.tipo,
                model: jsonData.model,
                url: jsonData.url,
                position: jsonData.position,
                scale: jsonData.scale,
                povs: jsonData.povs,
                customs: jsonData.customs
            };*/

        } catch (error) {
            console.error('Error loading moto data:', error);
        }
    }

    // Function to get cookie by name
    getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    // Function to update cookie with current configuration
    updateCookie() {
        const config = this.moto.customs.map(custom => custom.selected);
        const selectedPieces = this.rightBar.selectedPieces;
        const piezaEditando = this.piezaEditando;
        const cookieData = {
            config,
            selectedPieces,
            piezaEditando
        };

        document.cookie = this.path+`motoConfig=${JSON.stringify(cookieData)}; path=/; max-age=31536000`; // 1 year

        //const config = this.moto.customs.map(custom => custom.selected);
        //document.cookie = `motoConfig=${JSON.stringify(config)}; path=/; max-age=31536000`; // 1 year
    }

    quickCookie(path){
        document.cookie = `currentMoto=${path}; path=/; max-age=900`; // 15 min

    }

    restartExperience() {
        //Hide temporarily webgl canvas
        this.canvas.style.display = 'none';
        document.cookie = `currentMoto=; path=/; max-age=100`; 

        // Var restart
        this.piezaEditando = undefined;

        // Clear interface
        if(this.sceneSetup.mobilePov) this.sceneSetup.mobilePov.endMobilePov();

        // Clear existing state if necessary
        if (this.scene) {
            while (this.scene.children.length > 0) {
                this.scene.remove(this.scene.children[0]);
            }
        }

        // Reinitialize the model selection interface
        this.selectObject.init();
    }

    initScene() {
        // Initialize scene setup
        this.sceneSetup = new SceneSetup(this.canvas);
        this.scene = this.sceneSetup.scene;
        this.modelLoader = new ModelLoader(this.scene);
        this.piezaEditando = undefined;



        //this.outline = new Outline(this.scene ,this.sceneSetup.camera,this.sceneSetup.renderer);

        // Load main Object
        this.modelLoader.loadModel(this.moto, undefined, 0,false);
        // Generate boxes and model for each type of piece
        for (let i = 0; i < this.moto.customs.length; i++) {
            //console.log("resources.items["+i+""+this.moto.customs[i].id[this.moto.customs[i].selected]+"].scene");
            //console.log(this.modelLoader.resources)
            this.modelLoader.loadModel(this.moto.customs[i], i, this.moto.customs[i].selected);
        }

        // Time tick event
        this.time = new Time();
        this.time.on('tick', () => {
            this.update();
        });

        // Resize to set everything on load
        this.resizeEvent();

        // Initialize welcome
        this.welcome = new Welcome();

        // Animate start of scene
        this.sceneSetup.animateExposure();

    }

    resizeEvent(){
        if (this.sceneSetup) this.sceneSetup.resize();
    }

    update()
    {
        //this.stats.begin()
        this.sceneSetup.render();

        if(this.piezaEditando!=undefined){
            if(this.outline) this.outline.composer.render();
        }

        //console.log(this.sceneSetup.camera.position.x.toFixed(1)+","+this.sceneSetup.camera.position.y.toFixed(1)+','+this.sceneSetup.camera.position.z.toFixed(1))

        //this.stats.end()
    }
}