export default class InteractionDetector {
    constructor() {
        this.isTouch = false;
        this.init();
    }

    init() {
        // Add event listeners for mouse and touch events
        window.addEventListener('mousemove', this.onMouseMove.bind(this));
        window.addEventListener('touchstart', this.onTouchStart.bind(this));
    }

    onMouseMove() {
        this.isTouch = false;
        // You can add additional logic here for cursor interactions
    }

    onTouchStart() {
        this.isTouch = true;
        // You can add additional logic here for touch interactions
    }

    // Method to check the current interaction type
    isTouchInteraction() {
        return this.isTouch;
    }
}