import { AssetLoader } from "./AssetLoader.js";
import { Room } from "./gu/room.js";

// Making the AssetLoader globally accessible
window.global = window.global || {};
window.global._assetLoader = new AssetLoader();


const assetsList =
    [
        { id: 'room', src: '/images/room.webp' },
        { id: 'chairMiddle', src: '/images/chair_middle.webp' },
        { id: 'chairLeft', src: '/images/chair_left.webp' },
        { id: 'painting', src: '/images/painting.webp' },
        { id: 'board', src: '/images/board.webp' },
        { id: 'spiral', src: '/images/spiral.webp' },
        { id: 'fakeRectanglePyramids', src: '/images/1.webp' },
        { id: 'swamp', src: '/images/2.webp' },
        { id: 'fakeSinglePyramidGreen', src: '/images/3.webp' },
        { id: 'desert', src: '/images/4.webp' },
        { id: 'lamp', src: '/images/5.webp' },
        { id: 'pyramids', src: '/images/6.webp' },
        { id: 'pyramidsDesertColored', src: '/images/7.webp' },
        { id: 'gentlemen', src: '/images/8.webp' },
        { id: 'sittingGentleman', src: '/images/9.webp' },
        { id: 'egyptThingy', src: '/images/10.webp' },
        { id: 'glassColors', src: '/images/11.webp' },
        { id: 'houseComplex', src: '/images/12.webp' },
        { id: 'workersBW', src: '/images/13.webp' },
        { id: 'woodMask', src: '/images/14.webp' },
        { id: 'gun', src: '/images/15.webp' },
        { id: 'alien', src: '/images/16.webp' },
        { id: 'bridge', src: '/images/17.webp' },
        { id: 'genuineTimes', src: '/images/18.webp' },
        { id: 'faceWithSpikes', src: '/images/19.webp' },
        { id: 'faceWithSpikes2', src: '/images/20.webp' }, // Assuming this is a different version from the one at id 'faceWithSpikes'
        { id: 'secondHead', src: '/images/21.webp' },
        { id: 'asset22', src: '/images/22.webp' }, // Placeholder name, replace with actual if available
        { id: 'asset23', src: '/images/23.webp' }, // Placeholder name, replace with actual if available
        { id: 'asset24', src: '/images/24.webp' }, // Placeholder name, replace with actual if available
        { id: 'asset25', src: '/images/25.webp' },  // Placeholder name, replace with actual if available
        { id: 'sound:click', src: '/sound/click.aac' },
        { id: 'sound:pageFlip1', src: '/sound/page_flip_1.m4a' },
        { id: 'sound:pageFlip2', src: '/sound/page_flip_2.m4a' },
        { id: 'sound:pageFlip3', src: '/sound/page_flip_3.m4a' },
    ]
AssetLoader.loadAssets(
    assetsList, simulate
).then(() =>  {
    setTimeout(() =>   {
        document.getElementById('loadingVideo').style.opacity= 0;
        document.getElementById('loadingVideo').style.pointerEvents= 'none';
        new Room()}, 1000)
})

const canvas = document.getElementById('c');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let currentAssetIndex = 0;
let loadingProgress = 0;


function updateLoadingScreen(id, src) {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

    // Draw the loading bar background
    ctx.fillStyle = '#828282';

    // Center the loading bar on the canvas
    const loadingBarWidth = Math.min(canvas.width - 100, 400);
    const loadingBarHeight = 3;
    const loadingBarX = (canvas.width - loadingBarWidth) / 2;
    const loadingBarY = canvas.height - loadingBarHeight - 30; // Position the bar 30px above the bottom of the canvas
    ctx.fillRect(loadingBarX, loadingBarY, loadingBarWidth, loadingBarHeight);

    // Draw the loading bar progress
    
    ctx.fillStyle = '#e6e6e6';
    ctx.fillRect(loadingBarX, loadingBarY, loadingBarWidth * (loadingProgress / assetsList.length), loadingBarHeight);


    // Draw the loading bar progress


    const currentAssetText = `Loading: ${Math.round(loadingProgress / assetsList.length*100)}%`;
    ctx.fillStyle = '#e6e6e6';
    ctx.font = '20px Arial';
    // Measure text to center it
    const textMetrics = ctx.measureText(currentAssetText);
    const textX = (canvas.width - textMetrics.width) / 2;
    const textY = loadingBarY - 10; // Position the text 10px above the loading bar
    ctx.fillText(currentAssetText, textX, textY);
}



function simulate(img, id, src) {
    currentAssetIndex++;
    loadingProgress++;
    updateLoadingScreen(id, src)
};