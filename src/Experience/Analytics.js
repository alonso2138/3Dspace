import Experience from "./Main";

export default class BottomBar {
    constructor(){
        let tiempoInicio = Date.now();
        let tiempoTotal = 0;
        
        function calcularTiempoActivo() {
            let tiempoActual = Date.now();
            tiempoTotal += (tiempoActual - tiempoInicio) / 1000; // Convertimos a segundos
            tiempoInicio = tiempoActual;
        }
        
        // Detectar cuando el usuario cambia de pestaña
        window.addEventListener("focus", () => { tiempoInicio = Date.now(); });
        window.addEventListener("blur", calcularTiempoActivo);
        
        // Al salir, enviar el tiempo total al servidor
        window.addEventListener("beforeunload", () => {
            calcularTiempoActivo();
            navigator.sendBeacon("/api/guardarSesion", JSON.stringify({
                tiempo: tiempoTotal,
                sessionId: localStorage.getItem("sessionId") || generarSessionId(),
                userAgent: navigator.userAgent
            }));
        });
        
        // Función para generar un ID de sesión único (si el usuario no lo tiene guardado)
        function generarSessionId() {
            let sessionId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            localStorage.setItem("sessionId", sessionId);
            return sessionId;
        }
        
    }

}