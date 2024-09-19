import { AssetLoader } from "../AssetLoader.js";
import { TextScrambler } from "../text-scrambler.js";
import { splitTextForCanvas } from "../utils.js";
import { Layer } from "./layer.js";

export class PinnedItem extends Layer {
  constructor(element, x, y, scale) {
    super(element, x, y, scale)
    this.element = element;
    this.x = x;
    this.y = y;
    this.scale = scale;
    this.isHovered = false;
    this.hoverScale = 1;  // Initial scale when not hovered
    this.targetScale = 1;  // Target scale
    this.scaleSpeed = 0.5;  // Speed at which the scale changes
    this.blurred = false;
    this.isDragging = false;
    this.offsetX = 0;
    this.offsetY = 0;

    // Drop shadow properties
    this.shadowOffsetX = 0;  // Horizontal distance of the shadow
    this.shadowOffsetY = 4;  // Vertical distance of the shadow
    this.shadowBlur = 10;    // Blur level of the shadow
    this.shadowColor = 'rgba(0, 0, 0, 0.6)'; // Color of the shadow
    this.scale = 1;
    this.title= "The Spiral";
    this.description = "In the eerie expanse of an undead universe, a mesmerizing black hole spiral dominates the void. Its inky tendrils stretch outward, ensnaring dying stars and celestial debris in a ghostly dance of destruction. The surrounding cosmos, a tapestry of lifeless worlds and extinct constellations, watches in silent awe as the spiral's gravitational fury bends light and reality, creating a vortex of haunting beauty amidst the desolation."
    // State
    this.open = false;
    this.veil = 0;
  }



  onClick() {

    if (this.open) {
      // Close modal
      this.title = this.savedPosition.title
      this.description = this.savedPosition.description
      gsap.to(this, {
        scale: this.savedPosition.scale,
        x: this.savedPosition.x,
        y: this.savedPosition.y,
        veil: 0,
        duration: 0.3,
        ease: "power1.out",
        onComplete: () => this.open = false
      })
    } else {
      // Open modal
      this.open = true;
      this.savedPosition = {
        x: this.x,
        y: this.y,
        scale: this.scale,
        title: this.title,
        description: this.description

      }

      new TextScrambler(this, 'description').scramble();
      new TextScrambler(this, 'title', {
        scrambleDuration: 600
      }).scramble();

      AssetLoader.getAsset('sound:pageFlip' + (Math.round(Math.random()*2) +1 )).play()
      
      gsap.to(this, {
        scale: 3,
        x: 0.2,
        y: 0.5,
        veil: 1,
        duration: .3,
        ease: "power1.out"
      })
    }
  }

  onMouseMove() {

  }

  onMouseEnter() {
    const targetScale = 1.05;
    gsap.to(this, {
      hoverScale: targetScale,
      duration: 0.3,
      ease: "power1.out",
    });
  }

  onMouseLeave() {
    const targetScale = 1;
    gsap.to(this, {
      hoverScale: targetScale,
      duration: 0.3,
      ease: "power1.out",
    });
  }

  onUpdate() {

  }



  draw(ctx, boardX, boardY, boardWidth, boardHeight, globalScale, renderScale = 1) {
    if (this.veil > 0 && this.open) {
      ctx.save();
      ctx.fillStyle = 'rgba(0,0,0,' + this.veil + ')';
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.restore();
    }
    const image = AssetLoader.getAsset(this.element)
    const scale = globalScale * this.scale * this.hoverScale * renderScale;
    this.drawingWidth = (image.width * scale);
    this.drawingHeight = (image.height * scale);
    this.drawingX = boardX + (boardWidth * this.x) - (this.drawingWidth / 2);
    this.drawingY = boardY + (boardHeight * this.y) - (this.drawingHeight / 2);
    ctx.save();
    ctx.shadowOffsetX = this.shadowOffsetX;
    ctx.shadowOffsetY = this.shadowOffsetY;
    ctx.shadowBlur = this.shadowBlur;
    ctx.shadowColor = this.shadowColor;
    super.draw(ctx);

    if(this.veil > 0) {
      ctx.font = '16px Arial'; // Set the desired font
      const splitLines = splitTextForCanvas(this.description, 600, ctx);
      let height = splitLines.reduce((p,c) => p+ ctx.measureText(c).fontBoundingBoxAscent + 10 , 0) + 30;
      
      // Title
      ctx.font = '32px Arial'; // Set the desired font
      const titleHeight  =ctx.measureText(this.title).fontBoundingBoxAscent;
      height += titleHeight;      
      
      
      ctx.fillStyle = 'rgba(255,255,255,' + this.veil**6 + ')';
      ctx.fillText(this.title, this.drawingX+ this.drawingWidth + 50, ctx.canvas.height/2 - height/2);
      
      // Description
      ctx.font = '16px Arial'; // Set the desired font
      
      
      ctx.fillStyle = 'rgba(255,255,255,' + this.veil**6 + ')';

      splitLines.forEach((v, i) => {
        ctx.fillText(v, this.drawingX+ this.drawingWidth + 50,  (ctx.canvas.height /2 - height/2) + titleHeight + 30 + (i*((height-30)/splitLines.length)) )
      })

    }
    ctx.restore();




  }



  checkHover(mouseX, mouseY, override, needsOpen) {
    if (override) {
      if (this.isHovered) this.onMouseLeave?.()
      this.isHovered = false;
      return;
    }

    if (
      mouseX > this.drawingX &&
      mouseX < this.drawingX + this.drawingWidth &&
      mouseY > this.drawingY &&
      mouseY < this.drawingY + this.drawingHeight &&
      (needsOpen ? this.open : true)
    ) {
      if (!this.isHovered) {
        this.onMouseEnter();
        this.isHovered = true;
      }
      this.onMouseMove();


    } else {
      if (!this.isHovered) {
        this.onMouseLeave();

      }
      this.isHovered = false;
    }
  }
}