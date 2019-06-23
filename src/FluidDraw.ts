
export interface SimpleColor {
    r: number;
    g: number;
    b: number;
}

export class SplatVector {
    private static readonly DEFAULT_SPEED = 500;
    private static readonly DEFUALT_SPAT_DENSITY = 20;

    readonly step_size: [number, number];
    readonly num_steps: number;
    readonly speed: [number, number];

    constructor(direction: number, magnitude: number, speed?: number, splat_density?: number) {
        const cos = Math.cos((Math.PI / 180.0) * direction);
        const sin = Math.sin((Math.PI / 180.0) * direction);
        // calculate xdist and ydist from direction and magnitude
        const dist = [Math.floor(magnitude * cos), Math.floor(magnitude * sin)];
        // calculate speed from direction
        speed = speed || SplatVector.DEFAULT_SPEED;
        this.speed = [Math.floor(speed * cos), Math.floor(speed * sin)];
        // calculate pixel step and number of steps from splat_density
        splat_density = splat_density || SplatVector.DEFUALT_SPAT_DENSITY;
        this.num_steps = magnitude / splat_density + 1;
        this.step_size = [Math.floor(dist[0] / this.num_steps), Math.floor(dist[1] / this.num_steps)];
    }
}

export class SplatVectorState {
    private readonly vector: SplatVector;
    private readonly pos: [number, number];
    private readonly color: SimpleColor;
    private readonly size: number;
    private cur_step: number;

    constructor(vector: SplatVector, pos: [number, number], color: SimpleColor, size: number) {
        this.vector = vector;
        this.pos = pos;
        this.color = color;
        this.size = size;
        this.cur_step = 0;
    }

    next_splat(): { pos: [number, number], vel: [number, number], color: { r: number, g: number, b: number }, size: number } | null {
        // check if we're done
        if (this.cur_step === this.vector.num_steps) return null;
        // else return the next splat place, calculated from the various deltas
        const ret = {
            pos: [
                this.pos[0] + this.vector.step_size[0] * this.cur_step,
                this.pos[1] + this.vector.step_size[1] * this.cur_step
            ],
            vel: this.vector.speed,
            color: this.color,
            size: this.size,
        };
        this.cur_step++;
        return ret as any;
    }
}
