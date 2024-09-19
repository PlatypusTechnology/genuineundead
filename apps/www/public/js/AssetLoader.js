export class AssetLoader {
    static instance = null; // Static reference to the instance
    static maxConcurrency = 4; // Maximum number of concurrent loading operations
    static currentConcurrency = 0; // Current number of ongoing loading operations
    static loadingQueue = []; // Queue to hold loading tasks when maxConcurrency is reached

    constructor() {
        if (AssetLoader.instance) {
            return AssetLoader.instance; // Return the existing instance if it already exists
        }
        this.assets = {}; // Initialize assets storage
        AssetLoader.instance = this; // Set the static reference to the new instance
    }

    // Function to manage the loading queue
    static processQueue() {
        if (AssetLoader.loadingQueue.length > 0 && AssetLoader.currentConcurrency < AssetLoader.maxConcurrency) {
            const nextTask = AssetLoader.loadingQueue.shift(); // Get the next task from the queue
            AssetLoader.loadAsset(nextTask.src, nextTask.id, nextTask.callback); // Load the next asset
        }
    }

    // Load an individual asset with concurrency control
    static loadAsset(src, id, callback) {
        return new Promise((resolve, reject) => {
            const task = () => {
                // Determine the type of the asset from the file extension
                const fileType = src.split('.').pop().toLowerCase();

                let asset;
                if (fileType === 'png' || fileType === 'jpg' || fileType === 'jpeg' || fileType === 'gif' || fileType === 'webp') {
                    asset = new Image();
                } else if (fileType === 'mp3' || fileType === 'wav' || fileType === 'ogg' || fileType === 'aac' || fileType === 'm4a') {
                    asset = new Audio();
                } else {
                    reject(new Error('Unsupported file type'));
                    return;
                }

                asset.onload = asset.oncanplaythrough = () => {
                    AssetLoader.instance.assets[id] = asset; // Store the loaded asset with its ID
                    resolve(asset); // Resolve the promise with the loaded asset
                    if (typeof callback === 'function') {
                        callback(asset, id, src);
                    }
                    AssetLoader.currentConcurrency--; // Decrement the concurrency count
                    AssetLoader.processQueue(); // Process the next task in the queue, if any
                };
                asset.onerror = () => {
                    reject(new Error('Asset loading failed')); // Reject the promise on an error
                    AssetLoader.currentConcurrency--; // Decrement the concurrency count
                    AssetLoader.processQueue(); // Process the next task in the queue, if any
                };
                asset.src = src;

                // If the asset is audio, we need to trigger load explicitly
                if (asset instanceof Audio) {
                    asset.load();
                }
            };

            if (AssetLoader.currentConcurrency < AssetLoader.maxConcurrency) {
                AssetLoader.currentConcurrency++; // Increment the concurrency count
                task(); // Execute the loading task immediately
            } else {
                AssetLoader.loadingQueue.push({ src, id, callback, task }); // Add the task to the queue
            }
        });
    }

    // Load multiple assets with concurrency control
    static loadAssets(assetList, callback) {
        const promises = assetList.map(asset =>
            new Promise((resolve, reject) => {
                AssetLoader.loadAsset(asset.src, asset.id, (loadedAsset, id, src) => {
                    if (typeof callback === 'function') {
                        callback(loadedAsset, id, src);
                    }
                    resolve(loadedAsset);
                }).catch(reject);
            })
        );
        return Promise.all(promises); // Return a promise that resolves when all assets are loaded
    }

    static getAsset(id) {
        const asset = AssetLoader.instance.assets[id];
        if (asset instanceof Audio) {
            // If the asset is an Audio object, create and return a new Audio instance with the same src
            const newAudioInstance = new Audio();
            newAudioInstance.src = asset.src;
            return newAudioInstance;
        }
        return asset; // Return the original asset for non-audio assets
    }
}
