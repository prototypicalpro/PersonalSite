import * as React from "react";
import useAnimation from "./useAnimation";
import { Fluid } from "stam-stable-fluids";

const FLUID_SIZE = 50;

/**
 * Converts an HSV color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
 * Assumes h, s, and v are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   Number  h       The hue
 * @param   Number  s       The saturation
 * @param   Number  v       The value
 * @return  Array           The RGB representation
 */
function hsvToRgb(h: number, s: number, v: number): [number, number, number] {
    let r, g, b;

    const i = Math.floor(h * 6);
    const f = h * 6 - i;
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);

    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }

    return [ r * 255, g * 255, b * 255 ];
}

function clamp(num: number, min: number, max: number): number {
    return num <= min ? min : num >= max ? max : num;
}

function drawFluid(ctx: CanvasRenderingContext2D, width: number, height: number, grid_size: number, cur_step: number, fluid: any): void {
    fluid.step(1 / 60);

    // const [vx, vy] = f.velocityAt(0, 0)
    // const d = f.densityAt(0, 0)

    // draw a grid of dots every 10 or so pixels
    const x_coord_count = width / grid_size;
    const y_coord_count = height / grid_size;
    const FLUID_FACTOR = 1000;

    for (let x = 0; x < Math.min(x_coord_count, FLUID_SIZE); x++) {
        for (let y = 0; y < Math.min(y_coord_count, FLUID_SIZE); y++) {
            const [flv_x, flv_y] = fluid.velocityAt(x, y);
            const d = fluid.densityAt(x, y);
            // draw a dot offsett by the fluid velocity
            const x_coord = Math.round(x * grid_size + flv_x * FLUID_FACTOR);
            const y_coord = Math.round(y * grid_size + flv_y * FLUID_FACTOR);
            //const [r, g, b] = hsvToRgb(clamp(d / 10.0, 0, 1), 1, 1);
            //ctx.fillStyle = `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`;
            ctx.fillStyle = "green";
            ctx.fillRect(x_coord, y_coord, 2, 2);
        }
    }
}

function resetFluid(fluid: any) {
    for (let y = 0; y < FLUID_SIZE; y++)
            for (let x = 0; x < FLUID_SIZE / 2; x++)
                fluid.addDensity(x, y, 10);
    for (let y = 0; y < FLUID_SIZE; y++)
        fluid.addForce(10, y, 10, 0);
}

const FluidDots: React.FunctionComponent<{ className: string }> = ({ className = "" }) => {
    const canvas_ref = React.useRef<HTMLCanvasElement>();
    const time_step = React.useRef<number>(0);
    const fluid_ref = React.useRef<any>(new Fluid(FLUID_SIZE));

    resetFluid(fluid_ref.current);

    useAnimation(() => {
        const ctx = canvas_ref.current.getContext("2d");
        ctx.clearRect(0, 0, 1440, 700);
        drawFluid(ctx, canvas_ref.current.width, canvas_ref.current.height, 10, time_step.current++, fluid_ref.current);
        if (time_step.current > 100000) time_step.current = 0;
    }, () => {
        time_step.current = 0;
        fluid_ref.current = new Fluid(FLUID_SIZE);
        resetFluid(fluid_ref.current);
    });

    return (
        <canvas ref={canvas_ref} className={className} width={1440} height={700}></canvas>
    );
};

export default FluidDots;