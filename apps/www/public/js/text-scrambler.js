export class TextScrambler {
    constructor(obj, property, options = {}) {
        this.obj = obj;
        this.property = property;
        this.originalText = obj[property];
        this.scrambleDuration = options.scrambleDuration || 1000; // Duration of the scramble effect in milliseconds
        this.frameRate = options.frameRate || 30; // How often to change the text (in frames per second)
        this.characters = '10'; // Characters used for scrambling
        this.scrambledText = ''; // Initial scrambled text
    }

    // Function to create an initial scrambled version of the text
    createInitialScramble() {
        for (let i = 0; i < this.originalText.length; i++) {
            this.scrambledText += this.originalText[i] === ' ' ? ' ' : this.characters[Math.floor(Math.random() * this.characters.length)];
        }
    }

    scramble() {
        this.createInitialScramble(); // Create the initial scrambled text

        const frameInterval = 1000 / this.frameRate;
        const totalFrames = this.scrambleDuration / frameInterval;
        let frame = 0;

        const scrambleInterval = setInterval(() => {
            let partiallyRevealedText = '';
            for (let i = 0; i < this.originalText.length; i++) {
                // Reveal the original character based on the current frame, otherwise use the scrambled character
                partiallyRevealedText += frame >= totalFrames * (i / this.originalText.length) ?
                    this.originalText[i] :
                    this.scrambledText[i];
            }

            this.obj[this.property] = partiallyRevealedText; // Update the object's property with the partially revealed text

            frame++;
            if (frame >= totalFrames) {
                clearInterval(scrambleInterval);
                this.obj[this.property] = this.originalText; // Ensure the final text is the original text at the end
            }
        }, frameInterval);
    }
}
