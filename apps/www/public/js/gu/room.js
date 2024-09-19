import { AssetLoader } from '../AssetLoader.js';
import { Board } from './board.js';
import { Layer } from './layer.js';
import { FadeModulate } from './modulators/FadeModulate.js';
import { RelativeScale } from "./modulators/RelativeScale.js";
export class Room {
    static _instance;

    lastTouchPos = {
        x: undefined,
        y: undefined
    }

    constructor() {
        if (Room._instance) return Room._instance;
        Room._instance = this;
        this.nfts = window.nfts; // User's nfts
        this.layers = [];
        this.zoom = 1;
        this.fade = 1;
        this.canvas = document.getElementById('c');

        this.ctx = this.canvas.getContext('2d');
        this.init();
        this.backgroundImage = AssetLoader.getAsset('room');
        // const boardLayer = new Layer('/images/board.webp' ,.492, .41, 1).modulate(new RelativeScale(0.27)).modulate(new FadeModulate()).onClick(() => this.openBoard());
        const chair_middle_layer = new Layer('chairMiddle', 0.52, .721, .1).modulate(new RelativeScale(0.00065)).modulate(new FadeModulate());
        chair_middle_layer.setZ(105);
        const chair_left_layer = new Layer('chairLeft', 0.233, .756, .1).modulate(new RelativeScale(0.00063)).modulate(new FadeModulate());
        chair_left_layer.setZ(155);
        const painting_layer = new Layer('painting', 0.158, .371, .1).modulate(new RelativeScale(0.00065)).modulate(new FadeModulate());
        // this.layers.push(boardLayer);
        this.layers.push(new Board(this.canvas));
        this.layers.push(painting_layer);
        this.layers.push(chair_middle_layer);
        this.layers.push(chair_left_layer);
        this.particlesArray = [];
        this.mouseX = this.canvas.width / 2;
        this.mouseY = this.canvas.height / 2;
        this.mouseHistory = [];
        //this.cameraShake = new CameraShake(this.canvas, this.ctx);

        this.animate();
        this.initEvents();
    }

    init() {
        /*for (let i = 0; i < 1000; i++) {
            let x = Math.random() * this.canvas.width;
            let y = Math.random() * this.canvas.height;
            let size = Math.random() * 0.4 + 0.2;
            let weight = Math.random() * 2 - 0.5;
            this.particlesArray.push(new Particle(x, y, size, weight, this.ctx, this.canvas));
        }
        if (this.cameraShake)
            this.cameraShake.startShake(180, .2);*/
        this.zoom = .5;
        this.veil = 1;
        this.ctx.globalAlpha = 0;
        gsap.to(this, {
            zoom: 1.05,
            veil: 0,
            duration: 1,
            delay: .5,
            ease: "power3.out",
        });


    }

    initEvents() {

        this.canvas.addEventListener('pointermove', (event) => {

            if (event.pointerType === 'mouse') {
                this.handleMouseMove({
                    x: event.clientX,
                    y: event.clientY,
                })
            } else {
                this.mouseX -= event.movementX;
                this.mouseY -= event.movementY;
                this.mouseX = Math.min(Math.max(0, this.mouseX), this.canvas.width)
                this.mouseY = Math.min(Math.max(0, this.mouseY), this.canvas.height)
            }
        })

        this.canvas.addEventListener('click', (event) => {
            // this.board.handleMouseClick(event);
        });
        // this.canvas.addEventListener('touch', (event) => this.board.handleMouseClick(event));
    }

    handleMouseMove(event) {
        this.mouseX = event.x;
        this.mouseY = event.y;
        this.mouseHistory.push({ x: this.mouseX, y: this.mouseY });

    }

    openBoard() {
        this.zoomAndFade();
    }

    checkZoomAndFade(event) {
        const x = event.clientX;
        const y = event.clientY;

        const middleAreaSize = 100;  // You can adjust this size to control the "middle" area
        const xMid = this.canvas.width / 2;
        const yMid = this.canvas.height / 2;

        if (x > xMid - middleAreaSize && x < xMid + middleAreaSize &&
            y > yMid - middleAreaSize && y < yMid + middleAreaSize) {
            this.zoomAndFade();
        }
    }

    zoomAndFade() {
        gsap.to(this, {
            zoom: 2,
            fade: 0,
            duration: 0.35,
            ease: "power1.out",
            //onUpdate: this.drawBackgroundImage  // Call `drawBackgroundImage` on each animation frame
        });
    }

    unzoom() {
        gsap.to(this, {
            zoom: 1.05,
            fade: 1,
            duration: 0.35,
            ease: "power1.out",
            //onUpdate: this.drawBackgroundImage  // Call `drawBackgroundImage` on each animation frame
        });
    }

    drawBackgroundImage() {
        if (!this.canvas) return;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        if (!this.backgroundImage) return;

        // Black background
        // This is not very demanding and adds a better view to screens taken with the browser UI of the canvas
        this.ctx.fillStyle = 'rgb(0,0,0)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Calculate the aspect ratio of the image
        const imageAspectRatio = this.backgroundImage.width / this.backgroundImage.height;
        const canvasAspectRatio = this.canvas.width / this.canvas.height;

        let renderableWidth, renderableHeight;
        let xStart, yStart;

        if (canvasAspectRatio < imageAspectRatio) {
            renderableHeight = this.canvas.height * this.zoom;

            renderableWidth = this.canvas.height * imageAspectRatio * this.zoom;
            xStart = (this.canvas.width - renderableWidth) / 2;
            yStart = (this.canvas.height - renderableHeight) / 2;
        } else if (canvasAspectRatio > imageAspectRatio) {

            renderableWidth = this.canvas.width * this.zoom;
            renderableHeight = this.canvas.width / imageAspectRatio * this.zoom;
            xStart = (this.canvas.width - renderableWidth) / 2;
            yStart = (this.canvas.height - renderableHeight) / 2;
        } else {
            renderableHeight = this.canvas.height;
            renderableWidth = this.canvas.width;
            xStart = (this.canvas.width - renderableWidth) / 2;
            yStart = (this.canvas.height - renderableHeight) / 2;
        }

        // Adjust xStart based on mouse position to pan the image within boundaries
        if (this.mouseX !== undefined && this.veil === 0) {
            const mouseRelativeX = this.veil > 0 ? 0 : (this.mouseX / this.canvas.width) - 0.5;  // Range from -0.5 to 0.5
            const maxOffset = (renderableWidth - this.canvas.width) / 2;
            xStart -= mouseRelativeX * maxOffset * 4 / (this.zoom ** 3);  // Allow image to move based on mouse position
            xStart = Math.max(xStart, this.canvas.width - renderableWidth);  // Prevent image from moving too far left
            xStart = Math.min(xStart, 0);  // Prevent image from moving too far right
            this.mouseOffset = Math.min(1, Math.max(-1, (this.mouseX / (this.canvas.width / 4) - 2)));
            //console.log({mX: mouseRelativeX, xStart, fixed: (this.canvas.width - renderableWidth) / 2})
        }


        // Adjust the drawImage to account for zoom and fade effects
        const width = renderableWidth;
        const height = renderableHeight;
        const x = xStart
        const y = yStart;
        this.baseX = x;
        this.baseY = y;
        this.baseWidth = width;
        this.baseHeight = height;



        this.ctx.save()
        this.ctx.globalAlpha = this.fade;
        this.ctx.drawImage(this.backgroundImage, this.baseX, this.baseY, width, height);
        this.ctx.restore()
        this.layers.forEach(l => l.update(this.ctx))
        this.layers.forEach(l => l.draw(this.ctx, xStart, yStart));



        const gradientEdge = 200;
        const grd = this.ctx.createRadialGradient(this.canvas.width / 2, this.canvas.height / 2, gradientEdge, (this.canvas.width ?? 1) / 2, (this.canvas.height ?? 1) / 2, renderableWidth / 1.5);
        grd.addColorStop(1, 'rgba(0, 0, 0, 1)');
        grd.addColorStop(0, 'rgba(0, 0, 0, ' + Math.sqrt(this.veil) + ')');

        this.ctx.fillStyle = grd;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        if (this.veil > 0) {
            this.ctx.fillStyle = 'rgba(0,0,0,' + this.veil + ')';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }
        //this.board.draw(this.ctx);
    }

    animate(time) {

        // If 'lastTime' is not defined, initialize it with the current time
        if (!this.lastTime) this.lastTime = time;
        // Calculate the time difference since the last frame
        const deltaTime = time - this.lastTime;
        // Calculate the target frame interval for 60 FPS
        const targetInterval = 1000 / 60;


        // Draw background and particles conditionally based on the elapsed time
        if (deltaTime > targetInterval) {
            // Clear the canvas
            this.ctx.fillStyle = 'black';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

            if (this.cameraShake)
                this.cameraShake.draw(() => this.drawBackgroundImage());
            else this.drawBackgroundImage();

            for (let i = 0; i < this.particlesArray.length; i++) {
                this.particlesArray[i].update(this.particlesArray, this.mouseHistory);
            }

            // Update 'lastTime' for the next frame, adjusting for any excess time spent
            this.lastTime = time - (deltaTime % targetInterval);
        }

        // Request the next frame
        requestAnimationFrame((newTime) => this.animate(newTime));
    }

    // Determine if the user has the nft
    hasNFT(tokenId) {
        return this.nfts.find((nft) => Number(nft.tokenId) == Number(tokenId))
    }
}