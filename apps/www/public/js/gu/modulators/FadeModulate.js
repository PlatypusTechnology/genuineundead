import { Room } from "../room.js";

export class FadeModulate {

    apply(layer, ctx) {
        layer.opacity = Room._instance.fade
    }
}