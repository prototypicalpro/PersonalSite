/**
 * A canvas test using react!
 */

import * as React from "react";
import useAnimation from "./useAnimation";

function clamp(num: number, min: number, max: number): number {
    return num <= min ? min : num >= max ? max : num;
}

function coordToIndex(x: number, y: number, width: number, height: number, step: number): number {
    const x_clamp = clamp(x, 0, width);
    const y_clamp = clamp(y, 0, height);
    return y_clamp * step * width + x_clamp * step;
}

function drawSurface(image_data: ImageData, grid_size: number, cur_step: number) {
    // draw a grid of dots every 10 or so pixels
    const x_coord_count = image_data.width / grid_size;
    const y_coord_count = image_data.height / grid_size;
    const sinstep = (3 * Math.PI) / x_coord_count;
    const STEP_FACTOR = 0.025;

    for (let x = 0; x < x_coord_count; x++) {
        for (let y = 0; y < y_coord_count; y++) {
            const x_radian = x * sinstep + cur_step * STEP_FACTOR;
            const y_radian = y * sinstep + cur_step * STEP_FACTOR;
            // draw a dot offset by the slope of a sine curve
            const x_coord = Math.round(x * grid_size + (y & 1 ? grid_size / 2 : 0) + Math.sin(x_radian) * Math.cos(y_radian) * 75);
            const y_coord = Math.round(y * grid_size + Math.cos(x_radian) * Math.sin(y_radian) * 75);
            const index = coordToIndex(x_coord, y_coord, image_data.width, image_data.height, 4);
            image_data.data[index] = 0;
            image_data.data[index + 1] = 0;
            image_data.data[index + 2] = 255;
            image_data.data[index + 3] = 255;
        }
    }
}

const Particles: React.FunctionComponent<{ className: string }> = ({ className = "" }) => {
    const canvas_ref = React.useRef<HTMLCanvasElement>();
    const time_step = React.useRef<number>(0);

    useAnimation(() => {
        const ctx = canvas_ref.current.getContext("2d");
        ctx.clearRect(0, 0, 1440, 700);
        const image_data = ctx.getImageData(0, 0, canvas_ref.current.width, canvas_ref.current.height);
        drawSurface(image_data, 10, time_step.current++);
        if (time_step.current > 100000) time_step.current = 0;
        ctx.putImageData(image_data, 0, 0);
    }, () => time_step.current = 0);

    return (
        <canvas ref={canvas_ref} className={className} width={1440} height={700}></canvas>
    );
 };

 export default Particles;

