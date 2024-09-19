export class Particle {
    MIN_VELOCITY = 0.2;
    constructor(x, y, size, weight, ctx, canvas) {
        this.ctx = ctx;
        this.canvas = canvas
        this.x = x;
        this.y = y;
        this.size = size;
        this.weight = weight;
        this.directionX = Math.random() * 1 - 0.5;
        this.directionY = Math.random() * 1 - 0.5;
        this.lastInteraction = Date.now();
    }

    draw() {
        this.ctx.fillStyle = 'rgba(255,255,255,0.8)';
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        this.ctx.closePath();
        this.ctx.fill();
    }
    checkParticleCollision(particles) {
        for (let particle of particles) {
            if (this === particle) continue;

            const dx = this.x - particle.x;
            const dy = this.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const combinedRadius = this.size + particle.size;

            if (distance < combinedRadius) {
                // Using the conservation of momentum for the collision
                const angle = Math.atan2(dy, dx);
                const thisMass = Math.PI * this.size * this.size;
                const particleMass = Math.PI * particle.size * particle.size;
                const totalMass = thisMass + particleMass;

                const velocityBeforeCollision1 = {
                    x: this.directionX,
                    y: this.directionY
                };

                const velocityBeforeCollision2 = {
                    x: particle.directionX,
                    y: particle.directionY
                };

                this.directionX = (velocityBeforeCollision1.x * (thisMass - particleMass) + (2 * particleMass * velocityBeforeCollision2.x)) / totalMass;
                this.directionY = (velocityBeforeCollision1.y * (thisMass - particleMass) + (2 * particleMass * velocityBeforeCollision2.y)) / totalMass;

                particle.directionX = (velocityBeforeCollision2.x * (particleMass - thisMass) + (2 * thisMass * velocityBeforeCollision1.x)) / totalMass;
                particle.directionY = (velocityBeforeCollision2.y * (particleMass - thisMass) + (2 * thisMass * velocityBeforeCollision1.y)) / totalMass;

                // Resolve overlap
                const overlap = combinedRadius - distance;
                this.x += overlap * Math.cos(angle) / 2;
                this.y += overlap * Math.sin(angle) / 2;
                particle.x -= overlap * Math.cos(angle) / 2;
                particle.y -= overlap * Math.sin(angle) / 2;
            }
        }
    }


    drawWindEffect(radius) {
        const windRadius = radius;  // Adjust the constants as needed
        this.ctx.strokeStyle = 'red';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, windRadius, 0, Math.PI * 2);
        this.ctx.stroke();
    }

    update(particles, mouseHistory) {
        const now = Date.now();
        if (now - this.lastInteraction > 10) { // delay of 500ms
            for (let i = 0; i < mouseHistory.length; i++) {
                const weight = Math.pow(0.98, length - i - 1); // Exponential decay factor
                const data = mouseHistory[i];
                const dx = this.x - data.x;
                const dy = this.y - data.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < 100) {
                    this.directionX += (this.x - data.x) / 200000 * weight;
                    this.directionY += (this.y - data.y) / 200000 * weight;
                }
            }
        }

        this.x += this.directionX;
        this.y += this.directionY;
        this.directionX *= 0.999;
        this.directionY *= 0.999;
        if (this.x <= 0) {
            this.directionX = Math.max(Math.abs(this.directionX) * 0.6, this.MIN_VELOCITY);  // Ensure it's positive and above the minimum
            this.x = 0;  // Reset particle position
        } else if (this.x >= this.canvas.width) {
            this.directionX = -Math.max(Math.abs(this.directionX) * 0.6, this.MIN_VELOCITY);  // Ensure it's negative and above the minimum
            this.x = this.canvas.width;  // Reset particle position
        }

        if (this.y <= 0) {
            this.directionY = Math.max(Math.abs(this.directionY) * 0.6, this.MIN_VELOCITY);  // Ensure it's positive and above the minimum
            this.y = 0;  // Reset particle position
        } else if (this.y >= this.canvas.height) {
            this.directionY = -Math.max(Math.abs(this.directionY) * 0.6, this.MIN_VELOCITY);  // Ensure it's negative and above the minimum
            this.y = this.canvas.height;  // Reset particle position
        }


        this.checkParticleCollision(particles);

        this.directionX = Math.min(0.4, Math.max(-0.4, this.directionX))
        this.directionY = Math.min(0.4, Math.max(-0.4, this.directionY))

        this.draw();
    }
}