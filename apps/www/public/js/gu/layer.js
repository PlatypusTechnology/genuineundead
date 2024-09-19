import { AssetLoader } from "../AssetLoader.js";
import { Room } from "./room.js";

export class Layer {


    constructor(imageSource, x, y, scale) {
        this.x = x;
        this.y = y;
        this.scale = scale;
        this.modulators = []
        this.imageSource = AssetLoader.getAsset(imageSource);
        if(!this.imageSource) throw new Error('Missing asset: ' + imageSource)
        this.align = 'center';
        this.opacity = 1;
        this.eventHandler = null;
        this.Z = 0;
        this.layerGroup = Room._instance;
    }

    setZ(z) {
        this.Z = z;
    }

    setLayerGroup(group) {
        this.layerGroup = group;
        return this;
    }

    setAlignment(type) {
        this.align = type;
        return this;
    }

    modulate(modulator) {
        this.modulators.push(modulator)
        return this;
    }

    update(ctx) {
        this.drawingWidth = this.imageSource.width * this.scale;
        this.drawingHeight = this.imageSource.height * this.scale;

        this.drawingX = Room._instance.baseWidth  * this.x 
        this.drawingY = Room._instance.baseHeight * this.y 

        if (this.align === 'center') {
            this.drawingX -= this.drawingWidth / 2
            this.drawingY -= this.drawingHeight / 2
        }

        this.drawingX += (Room._instance.baseX ||0)+ ( ((this.Z*((Room._instance.baseX)-((Room._instance.canvas.width- Room._instance.baseWidth)/2))*0.001)) )
        this.drawingY += (Room._instance.baseY ||0)+ ( ((this.Z*((Room._instance.baseY)-((Room._instance.canvas.height- Room._instance.baseHeight)/2))*0.001)) )

        this.modulators.forEach(m => m.apply(this, ctx))
        if(this.onUpdate) this.onUpdate()
    }

    onClick(fn) {
        this.unregisterClick(); // Unregister any existing click event to avoid duplicates

        if (fn) {
            this.registerHover(); // Register hover effect when onClick is set

            this.eventHandler = (e) => {

                const rect = Room._instance.ctx.canvas.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const clickY = e.clientY - rect.top;

                // Check if the click was inside this layer's bounds
                if (
                    clickX >= this.drawingX &&
                    clickX <= this.drawingX + this.drawingWidth &&
                    clickY >= this.drawingY &&
                    clickY <= this.drawingY + this.drawingHeight
                ) {
                    const isTopmostAtClick = this.layerGroup.layers.slice(this.layerGroup.layers.indexOf(this) + 1).every(layer => {
                        // Calculate the bounding box for each layer above this one
                        const layerTopLeftX = layer.drawingX;
                        const layerTopLeftY = layer.drawingY;
                        const layerBottomRightX = layer.drawingX + layer.drawingWidth;
                        const layerBottomRightY = layer.drawingY + layer.drawingHeight;
    
                        // Return true if the click is outside this layer's bounding box, meaning this layer is topmost at the click point
                        return clickX < layerTopLeftX || clickX > layerBottomRightX || clickY < layerTopLeftY || clickY > layerBottomRightY;
                    });
    
                    // If this layer is the topmost at the click point, execute the callback function
                    if (isTopmostAtClick) {
                        fn(e);
                        e.stopPropagation(); // Stop the event from propagating further
                    }
                }
            };

            Room._instance.ctx.canvas.addEventListener('click', this.eventHandler);
        } else this.unregisterHover()
        return this;
    }




    unregisterClick() {
        if (this.eventHandler) {
            Room._instance.ctx.canvas.removeEventListener('click', this.eventHandler);
            this.eventHandler = null;
        }
    }

    onOutsideClick(fn) {
        this.unregisterOutsideClick(); // Unregister any existing outside click event to avoid duplicates
    
        if (fn) {
            this.outsideEventHandler = (e) => {
                const rect = Room._instance.ctx.canvas.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const clickY = e.clientY - rect.top;
    
                // Check if the click was outside this layer's bounds
                if (
                    clickX < this.drawingX ||
                    clickX > this.drawingX + this.drawingWidth ||
                    clickY < this.drawingY ||
                    clickY > this.drawingY + this.drawingHeight
                ) {
                    fn(e); // Execute the callback function
                    e.stopPropagation(); // Stop the event from propagating further
                }
            };
    
            Room._instance.ctx.canvas.addEventListener('click', this.outsideEventHandler);
        }
        return this;
    }
    
    unregisterOutsideClick() {
        if (this.outsideEventHandler) {
            Room._instance.ctx.canvas.removeEventListener('click', this.outsideEventHandler);
            this.outsideEventHandler = null;
        }
    }

    registerHover(fn) {
        if(this.hoverHandler) this.unregisterHover();
        this.hoverHandler = fn ? fn : (e) => {

            const rect = Room._instance.ctx.canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            // Check if the mouse is inside this layer's bounds
            if (
                mouseX >= this.drawingX &&
                mouseX <= this.drawingX + this.drawingWidth &&
                mouseY >= this.drawingY &&
                mouseY <= this.drawingY + this.drawingHeight
                && !this.isDisabled()
                ) {
                    Room._instance.ctx.canvas.style.cursor = 'pointer';
                    if(!this.glowing) {
                        gsap.to(this, {
                            blurRadius: 20,
                            blurOpacity:0.7,
                            duration: 0.2,
                            ease: "power1.out",
                        });
                        
                    }
                    this.glowing= true;
                } else {
                    Room._instance.ctx.canvas.style.cursor = '';
                    if(this.glowing)
                    gsap.to(this, {
                        blurRadius: 0,
                        blurOpacity: 0,
                        duration: 0.2,
                        ease: "power1.out",
                        onComplete: () => this.glowing = false
                    });
                }
        };

        Room._instance.ctx.canvas.addEventListener('mousemove', this.hoverHandler);
    }

    unregisterHover() {
        if (this.hoverHandler) {
            Room._instance.ctx.canvas.removeEventListener('mousemove', this.hoverHandler);
            Room._instance.ctx.canvas.style.cursor = ''; // Reset cursor style
            this.hoverHandler = null;
        }
    }


    draw(ctx) {
        const prevAlpha = ctx.globalAlpha;
        ctx.save()
        ctx.globalAlpha *= this.opacity;
        if(this.glowing){
            ctx.save()
            ctx.shadowColor = 'rgba(255, 255, 255, '+this.blurOpacity+')'; // White glow, adjust color and alpha as needed
            ctx.shadowBlur = this.blurRadius; // Adjust blur radius to control the extent of the glow
        }
        ctx.drawImage(this.imageSource, this.drawingX , this.drawingY, this.drawingWidth, this.drawingHeight);
        if(this.glowing) {
            ctx.restore()
        }
        ctx.globalAlpha = prevAlpha;
        ctx.restore()
    }

    isTopLayer() {
        const index = this.layerGroup.layers.indexOf(this);
        return index === this.layerGroup.layers.length - 1;
    }

    isDisabled() {
        return this.opacity === 0
    }
}