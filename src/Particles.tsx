/**
 * A canvas test using react!
 */

import * as React from "react";

function coordToIndex(x: number, y: number, width: number, height: number, step: number): number | null {
    if (x < 0 || x > width || y < 0 || y > height) return null;
    return y * step * width + x * step;
}

function setPixel(x: number, y: number, width: number, height: number, step: number, color: Array<number>, array: any) {
    const index = coordToIndex(x, y, width, height, step);
    if (index !== null)
        for (let i = index, len = Math.min(index + step, array.length); i < len; i++)
            array[i] = color[i - index];
}

function drawSurface(image_data: ImageData, grid_size: number, cur_step: number, color: [number, number, number, number], opposite?: boolean) {
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
            let y_coord = Math.round(y * grid_size + Math.cos(x_radian) * Math.sin(y_radian) * 75);
            if (opposite) y_coord = image_data.height - y_coord;
            [   [x_coord, y_coord],
                [x_coord + 1, y_coord],
                [x_coord, y_coord + 1],
                [x_coord + 1, y_coord + 1]
            ].map((c) =>
                    setPixel(c[0], c[1], image_data.width, image_data.height, 4, color, image_data.data));
        }
    }
}

const Particles: React.FunctionComponent<{ className?: string }> = ({ className = "" }) => {
    const forward_canvas_ref = React.useRef<HTMLCanvasElement | null>(null);
    const reverse_canvas_ref = React.useRef<HTMLCanvasElement | null>(null);
    const time_step = React.useRef<number>(0);
    const animation_ref = React.useRef<number | null>(null);

    const animation_callback = React.useCallback(() => {
        if (forward_canvas_ref.current) {
            const ctx = forward_canvas_ref.current.getContext("2d") as CanvasRenderingContext2D;
            ctx.clearRect(0, 0, 1440, 700);
            const image_data = ctx.getImageData(0, 0, forward_canvas_ref.current.width, forward_canvas_ref.current.height);
            drawSurface(image_data, 10, time_step.current, [128, 0, 128, 255]);
            ctx.putImageData(image_data, 0, 0);
        }
        if (reverse_canvas_ref.current) {
            const ctx = reverse_canvas_ref.current.getContext("2d") as CanvasRenderingContext2D;
            ctx.clearRect(0, 0, 1440, 700);
            const image_data = ctx.getImageData(0, 0, reverse_canvas_ref.current.width, reverse_canvas_ref.current.height);
            drawSurface(image_data, 10, 100000 - time_step.current, [0, 0, 255, 255], true);
            ctx.putImageData(image_data, 0, 0);
        }
        time_step.current++;
        if (time_step.current > 100000) time_step.current = 0;
        animation_ref.current = requestAnimationFrame(animation_callback);
    }, [forward_canvas_ref, reverse_canvas_ref, time_step, animation_ref]);

    React.useEffect(() => {
        if (animation_ref.current === null) animation_callback();

        return () => {
            if (animation_ref.current !== null) {
                cancelAnimationFrame(animation_ref.current);
                animation_ref.current = null;
            }
        };
    }, [animation_callback, animation_ref]);

    return (
        <div className={className || undefined}>
            <canvas ref={reverse_canvas_ref} width={1440} height={700} style={{ position: "absolute" }}></canvas>
            <canvas ref={forward_canvas_ref} width={1440} height={700} style={{ position: "absolute" }}></canvas>
        </div>
    );
 };

 export default Particles;

