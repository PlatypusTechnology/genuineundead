import { Room } from "../room.js";

export class ZoomModulate {

    apply(layer, ctx) {
        layer.scale *= Room._instance.zoom;
    }
}