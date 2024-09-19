import { Room } from "../room.js";


export class RelativeScale {

    constructor(scale, reference) {
        this.scale = scale;
        this.reference = reference;
    }
    apply(layer, ctx) {
        const imageAspectRatio = layer.imageSource.width / layer.imageSource.height;
        layer.scale = Math.min(1, (imageAspectRatio >= 1 ? this.reference ? this.reference.width : Room._instance.baseWidth / layer.imageSource.width : layer.imageSource.height / this.reference ? this.reference.height : Room._instance.baseHeight) * this.scale);
    }
}