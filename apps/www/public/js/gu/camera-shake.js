export class CameraShake {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.shakeDuration = 0;
        this.originalShakeDuration = 0; 
        this.shakeIntensity = 0;
        this.frequency = 1;
        this.elapsedTime = 0;
        this.offsetX = 0; // Phase offset for x direction
        this.offsetY = 2; // Phase offset for y direction
    }

    startShake(duration, intensity) {
        this.shakeDuration = duration;
        this.originalShakeDuration = duration; 
        this.shakeIntensity = intensity;
        this.elapsedTime = 0;
        this.offsetX = Math.random() * 2 * Math.PI; // Random phase offset for x direction
        this.offsetY = Math.random() * 2 * Math.PI; // Random phase offset for y direction
    }

    applyShake() {
        if (this.shakeDuration <= 0) {
            this.startShake(this.originalShakeDuration, this.shakeIntensity); // Restart with new random direction
            return;
        }

        const dx = Math.sin(this.elapsedTime * this.frequency + this.offsetX) * (Math.random() * this.shakeIntensity * 0.5);
        const dy = Math.sin(this.elapsedTime * this.frequency + this.offsetY) * (Math.random() * this.shakeIntensity * 0.5);

        this.ctx.save();
        this.ctx.translate(dx, dy);

        this.elapsedTime += 0.01;
        this.shakeDuration--;

        if (this.shakeDuration <= 0) {
            this.ctx.restore();
        }
    }

    draw(callback) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.applyShake();
        callback(this.ctx);
    }
}