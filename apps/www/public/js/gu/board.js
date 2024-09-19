import { AssetLoader } from '../AssetLoader.js';
import { Layer } from './layer.js';
import { RelativeScale } from './modulators/RelativeScale.js';
import { PinnedItem } from './pinned-item.js';
import { Room } from './room.js';
export class Board extends Layer {

  currentMousePos = { x: 0, y: 0 };


  constructor(canvas) {
    super('board', .492, .41, 1);
    this.canvas = canvas;
    this.sizeModulator = new RelativeScale(0.28);
    this.modulate(this.sizeModulator);
    this.layers = [];
    this.alpha = 1;
    this.visible = false;

    // TODO: Setup token gating

    this.pinElement('spiral', 0.5174792531628136, 0.5341968087894267, 1);
    this.pinElement('fakeRectanglePyramids', 0.184095105136787, 0.3814027939464494, 1);
    this.pinElement('swamp', 0.13890493124272416, 0.5429278230500582, 1);
    this.pinElement('fakeSinglePyramidGreen', 0.23695908214493602, 0.874708963911525, 1);
    this.pinElement('desert', 0.1926215530413272, 0.6811699650756694, 1);
    this.pinElement('lamp', 0.11929410106228179, 0.7975844004656577, 1);
    this.pinElement('pyramids', 0.3554764189708822, 0.5021827750291123, 1);
    this.pinElement('pyramidsDesertColored', 0.4322146035881129, 0.71463954452938, 1);
    this.pinElement('gentlemen', 0.37338199538156935, 0.8412404962178957, 1);
    this.pinElement('sittingGentleman', 0.485931318751465, 0.34938837237931974, 1);
    this.pinElement('egyptThingy', 0.3742348934080326, 0.3581199068684517, 1);
    this.pinElement('glassColors', 0.7059141287229024, 0.8004953623411319, 1);
    this.pinElement('houseComplex', 0.667545036414287, 0.675349594005358, 1);
    this.pinElement('workersBW', 0.562669517437405, 0.8470612296288619, 1);
    this.pinElement('woodMask', 0.7255249981250835, 0.493451674912663, 1);
    this.pinElement('gun', 0.8645063769318457, 0.5021827750291123, 1);
    this.pinElement('alien', 0.8969069437702322, 0.6462459269505267, 1);
    this.pinElement('bridge', 0.8977595902659792, 0.38285774010430446, 1);
    this.pinElement('genuineTimes', 0.8747385096200689, 0.8572478703466377, 1);
    if(Room._instance.hasNFT(36)) // TODO: Example if the user has the nft token 34 we show the asset
      this.pinElement('faceWithSpikes', 0.10906079982003286, 0.17622105645582076, 1);
    this.pinElement('faceWithSpikes2', 0.2420744350365302, 0.25916715512127186, 1); 
    this.pinElement('secondHead', 0.3998140367497266, 0.17622170401500298, 1);
    this.pinElement('asset22', 0.6325871930259507, 0.2111446602012128, 1); 
    this.pinElement('asset23', 0.8815596884072374, 0.18204211946745275, 1); 
    this.pinElement('asset24', 0.6313076916529935, 0.377036883729976, 1); 
    this.pinElement('asset25', 0.7830786365880065, 0.3042778390562602, 1); 
    // this.pinElement('/images/23.webp', 0.1, 0.8, 0.6);
    this.pins = []; // Array to hold pin objects
    this.createPins();

    document.addEventListener('keypress', (event) => {
      if (event.key === 'p' || event.key === 'P') {
        this.printPinPositions();
      }
      if (event.key === 'o' || event.key === 'O') {
        this.linkPreviousPins();
      }
    });
    canvas.addEventListener('mousemove', (event) => {
      const rect = canvas.getBoundingClientRect();
      this.currentMousePos.x = event.clientX;
      this.currentMousePos.y = event.clientY;
    });

    this.onClick((e) => this.handleMouseClick(e))
    this.onOutsideClick((e) => this.handleMouseClick(e))

  }

  open() {
    this.visible = true;
    AssetLoader.getAsset('sound:click').play()
    gsap.to(this.sizeModulator, {
      scale: 0.3,
      duration: 0.35,
      ease: "power1.out",

    });
    gsap.to(this, {
      x: 0.5, y: 0.5,
      duration: 0.35,
      ease: "power1.out",

    });
    this.registerHover((e) => this.handleMouseMove(e));
    Room._instance.zoomAndFade();
  }

  close() {
    this.visible = false;
    gsap.to(this.sizeModulator, {
      scale: 0.3,
      duration: 0.35,
      ease: "power1.out",

    });
    gsap.to(this, {
      x: .492, y: .41,
      duration: 0.35,
      ease: "power1.out",

    });
    this.registerHover();
    Room._instance.unzoom();
  }

  linkPreviousPins() {
    this.strings.push({
      from: this.pins.length - 1,
      to: this.pins.length
    })
    let codeString = 'this.pins = [\n';
    this.strings.forEach(string => {


      codeString += `  { from: ${string.from}, to: ${string.to} },\n`;
    });
    codeString += '];';
    console.log(codeString);
  }
  printPinPositions() {

    let codeString = 'this.pins = [\n';
    this.pins.push({
      id: this.pins.length + 1,
      x: (this.currentMousePos.x - this.pos.x) / this.pos.width,
      y: (this.currentMousePos.y - this.pos.y) / this.pos.height
    })
    this.pins.forEach(pin => {


      codeString += `  { id: ${pin.id}, x: ${pin.x}, y: ${pin.y} },\n`;
    });

    codeString += '];';
    console.log(codeString);
  }

  createPins() {
    this.pins = [
      { id: 1, x: 0.06685558016052015, y: 0.09473143626147562 },
      { id: 2, x: 0.15553081571820895, y: 0.10346253637792498 },
      { id: 3, x: 0.4548097357254086, y: 0.4497961743304162 },
      { id: 4, x: 0.2425007582844037, y: 0.21987720459724977 },
      { id: 5, x: 0.36016597469749073, y: 0.10491771973066655 },
      { id: 6, x: 0.43775680581046844, y: 0.10055216967244186 },
      { id: 7, x: 0.5937911145321708, y: 0.1383869368437224 },
      { id: 8, x: 0.6679713596621605, y: 0.14275248690194708 },
      { id: 9, x: 0.8495850632562731, y: 0.11510400319985746 },
      { id: 10, x: 0.9186494294117808, y: 0.1282006533745315 },
      { id: 11, x: 0.8964806205223587, y: 0.3304711394056083 },
      { id: 12, x: 0.724246028381463, y: 0.43960989086122526 },
      { id: 13, x: 0.8103633244519107, y: 0.4527065410358993 },
      { id: 14, x: 0.9288811873607449, y: 0.47162392462153957 },
      { id: 15, x: 0.8939226810351176, y: 0.5851282261353813 },
      { id: 16, x: 0.5920858215406768, y: 0.5240105253202357 },
      { id: 17, x: 0.9305864803522389, y: 0.7990401789883904 },
      { id: 18, x: 0.8120686174434047, y: 0.8150471958685476 },
      { id: 19, x: 0.731919846843186, y: 0.6273285433648865 },
      { id: 20, x: 0.5886752355576887, y: 0.628783726717628 },
      { id: 21, x: 0.5289899808553983, y: 0.628783726717628 },
      { id: 22, x: 0.5622431941895315, y: 0.7888538955191995 },
      { id: 23, x: 0.3652818536719728, y: 0.7888538955191995 },
      { id: 24, x: 0.48038913059781885, y: 0.605500793073763 },
      { id: 25, x: 0.382334783586913, y: 0.6680736772416501 },
      { id: 26, x: 0.4940314745297709, y: 0.6768047773580995 },
      { id: 27, x: 0.2953648410207182, y: 0.4599824577996071 },
      { id: 28, x: 0.2288584143524516, y: 0.813592012515806 },
      { id: 29, x: 0.15553081571820895, y: 0.751019128347919 },
      { id: 30, x: 0.08646644956270133, y: 0.7466535782896943 },
      { id: 31, x: 0.13591994631602777, y: 0.6593425771252008 },
      { id: 32, x: 0.25614310221635583, y: 0.6331492767758528 },
      { id: 33, x: 0.17940491759912516, y: 0.3304711394056083 },
      { id: 34, x: 0.08049792409247228, y: 0.4861757581489552 },
      { id: 35, x: 0.19816314050555933, y: 0.49927240832362924 },
      { id: 36, x: 0.3729555450889869, y: 0.3042776433335121 },
      { id: 37, x: 0.4889155955552889, y: 0.3028226557035187 },
      { id: 38, x: 0.7515307162453673, y: 0.24607050494659782 },
      { id: 39, x: 0.8052474454774287, y: 0.2431601382411147 },
      { id: 40, x: 0.7421516047921501, y: 0.751019128347919 },
      { id: 41, x: 0.6995192800047998, y: 0.3319263227583499 },
      { id: 42, x: 0.5699170126512546, y: 0.32174003928915895 },
    ];
    this.defineStrings()
  }

  defineStrings() {
    this.strings = [
      { from: 2, to: 3 },
      { from: 15, to: 16 },
      { from: 21, to: 22 },
      { from: 23, to: 24 },
      { from: 27, to: 28 },
      { from: 37, to: 38 },
      { from: 40, to: 41 },
    ];
  }

  pinElement(element, x, y, scale) {
    const pinnedItem = new PinnedItem(element, x, y, scale).setLayerGroup(this);
    this.layers.push(pinnedItem);
  }

  animate(ctx) {
    if (this.visible) {
      gsap.to(this, {
        alpha: 1,
        scale: 1,
        duration: 0.35,
        ease: "power1.out",
        onUpdate: () => {
          for (const item of [...this.layers].reverse()) {
            item.animate(false, ctx, this);
          }
        }
      });
    } else {
      gsap.to(this, {
        alpha: 1,
        scale: 0.3,
        duration: 0.5,
        ease: "power1.out"
      });
      Room._instance.unzoom();
    }
  }

  handleMouseMove(event) {
    const rect = this.canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    let override = false;
    let needsOpen = this.layers.some(i => i.open);
    for (const item of [...this.layers].reverse()) {
        item.checkHover(mouseX, mouseY, override,needsOpen);
        if (item.isHovered) override = true;
    }
  }

  handleMouseClick(event) {

    if (event.cancelBubble) return;

    if (!this.pos) return;
    const x = event.clientX;
    const y = event.clientY;


    if ((x >= this.pos.x && x <= this.pos.x + this.pos.width && y >= this.pos.y && y <= this.pos.y + this.pos.height) || this.layers.some(l => l.open)) {
      if (!this.visible) this.open()
      else {
        for (const item of [...this.layers].reverse()) {
          if (item.isHovered) {
            item.onClick();
            event.stopPropagation();
            break;
          }

        }
      }
    } else {

      if (this.visible) this.close()


    }
  }

  draw(ctx) {
    super.draw(ctx)


    const maxBoardWidth = this.canvas.width * 0.8;
    const maxBoardHeight = this.canvas.height * 0.8;

    const boardAspectRatio = this.imageSource.width / this.imageSource.height;
    let boardWidth, boardHeight;

    if (this.imageSource.width > this.imageSource.height) {
      // If the image is wider than it is tall
      boardWidth = Math.min(maxBoardWidth, maxBoardHeight * boardAspectRatio);
      boardHeight = boardWidth / boardAspectRatio;
    } else {
      // If the image is taller than it is wide
      boardHeight = Math.min(maxBoardHeight, maxBoardWidth / boardAspectRatio);
      boardWidth = boardHeight * boardAspectRatio;
    }

    boardWidth *= this.scale;
    boardHeight *= this.scale;



    this.pos = { x: this.drawingX, y: this.drawingY, width: this.drawingWidth, height: this.drawingHeight };

    //ctx.drawImage(this.imageSource, xStart, yStart, boardWidth, boardHeight);

    // Calculate the render scale based on the board size relative to the original image size
    const renderScale = this.pos.width / this.imageSource.width

    for (const item of this.layers.filter(l=>!l.open)) {
      item.draw(ctx, this.pos.x, this.pos.y, this.pos.width, this.pos.height, 1, renderScale);
    }
    // PINS
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)'; // Adjust the color and alpha as needed
    ctx.shadowBlur = 3; // Adjust the blur radius as needed
    ctx.shadowOffsetX = 0; // Adjust the horizontal offset as needed
    ctx.shadowOffsetY = 3; // Adjust the vertical offset as needed


    this.strings.forEach(string => {
      const fromPin = this.pins.find(pin => pin.id === string.from);
      const toPin = this.pins.find(pin => pin.id === string.to);

      if (fromPin && toPin) {
        const fromX = this.pos.x + fromPin.x * this.pos.width;
        const fromY = this.pos.y + fromPin.y * this.pos.height;
        const toX = this.pos.x + toPin.x * this.pos.width;
        const toY = this.pos.y + toPin.y * this.pos.height;

        // Calculate distance between pins
        const distance = Math.sqrt(Math.pow(toX - fromX, 2) + Math.pow(toY - fromY, 2));

        // Calculate slack based on distance, max slack is 20
        const slack = Math.min(distance / 4, 40); // Adjust the division factor as needed

        // Determine control point position, always shifting downwards
        const controlX = (fromX + toX) / 2;
        const maxY = Math.max(fromY, toY); // Find the lower of the two pins
        const controlY = (fromY + toY) / 2 + Math.min(maxY * 0.1, 10) + slack // Always add slack to shift downwards


        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.quadraticCurveTo(controlX, controlY, toX, toY);
        ctx.strokeStyle = '#5e0101'; // Change as needed
        ctx.lineWidth = 2; // Adjust line width as needed
        ctx.stroke();
      }
    });
    this.pins.forEach(pin => {
      const pinX = this.pos.x + pin.x * this.pos.width;
      const pinY = this.pos.y + pin.y * this.pos.height;
      const pinRadius = 10 * renderScale ?? 1; // Adjust pin radius as needed
      if (isNaN(pinX) || isNaN(pinY) || isNaN(pinRadius)) return;
      // Create gradient
      const gradient = ctx.createRadialGradient(pinX || 0, pinY || 0, 0, pinX || 1, pinY ?? 1, pinRadius ?? 1);
      gradient.addColorStop(0, 'red'); // Inner color
      gradient.addColorStop(1, 'black');  // Outer color - change as needed

      // Draw circle with gradient fill
      ctx.beginPath();
      ctx.arc(pinX, pinY, pinRadius, 0, 2 * Math.PI);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Draw black border
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    ctx.shadowColor = 'transparent';

    for (const item of this.layers.filter(l=>l.open)) {
      item.draw(ctx, this.pos.x, this.pos.y, this.pos.width, this.pos.height, 1, renderScale);
    }


  }

}