import HSVTypes from "./HSVTypes";

/** A utility class for describing and then tracking a discrete line of splats (fluid distortions) */

export default class SplatVector {
    static readonly DEFAULT_SPEED = 500;
    static readonly DEFUALT_SPAT_DENSITY = 20;
    static readonly DEFUALT_SIZE = 0.5;

    readonly step_size: [number, number];
    readonly num_steps: number;
    readonly speed: [number, number];
    readonly pos: [number, number];
    readonly color: HSVTypes.RGBColor;
    readonly size: number;
    private cur_step: number;

    /**
     * Describe a splat vector, and then initialize the needed state varibles for rendering it.
     * @param direction The angle (in degrees) for the vector
     * @param magnitude The length (in canvas pixels) for the vector
     * @param position x,y coordinates for the splat in canvas pixels
     * @param color RGB color [0, 255]
     * @param size The size of the splat (0.5 is a good place to start)
     * @param speed The speed of the splat, I think in pixels/sec
     * @param num_splats The number of splats to create along the vector. If this is not specified
     * it will be calculated by splatting every DEFAULT_SPLAT_DENSITY pixels
     */
    constructor(direction: number, magnitude: number, position: [number, number], color: HSVTypes.RGBColor, size?: number, speed?: number, num_splats?: number) {
        this.pos = position;
        this.color = color;
        this.size = size || SplatVector.DEFUALT_SIZE;
        this.cur_step = 0;
        const cos = Math.cos((Math.PI / 180.0) * direction);
        const sin = Math.sin((Math.PI / 180.0) * direction);
        // calculate xdist and ydist from direction and magnitude
        const dist = [Math.floor(magnitude * cos), Math.floor(magnitude * sin)];
        // calculate speed from direction
        speed = speed || SplatVector.DEFAULT_SPEED;
        this.speed = [Math.floor(speed * cos), Math.floor(speed * sin)];
        // calculate pixel step and number of steps from splat_density
        this.num_steps = num_splats || Math.floor(magnitude / SplatVector.DEFUALT_SPAT_DENSITY) + 1;
        this.step_size = [Math.floor(dist[0] / this.num_steps), Math.floor(dist[1] / this.num_steps)];
    }

    /** Get information for the next splat along the vector we have described */
    next_splat(): { pos: [number, number], vel: [number, number], color: { r: number, g: number, b: number }, size: number } | null {
        // check if we're done
        if (this.cur_step === this.num_steps) return null;
        // else return the next splat place, calculated from the various deltas
        const ret = {
            pos: [
                this.pos[0] + this.step_size[0] * this.cur_step,
                this.pos[1] + this.step_size[1] * this.cur_step
            ],
            vel: this.speed,
            color: this.color,
            size: this.size,
        };
        this.cur_step++;
        return ret as any;
    }
}
