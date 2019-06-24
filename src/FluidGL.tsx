import * as React from "react";
import styled from "styled-components";
import styledTS from "styled-components-ts";
import FluidRender from "./Fluid/FluidRender";
import HSVTools from "./Fluid/HSVTools";
import useInsideViewport from "./useInsideViewport";
import SplatVector from "./Fluid/FluidDraw";

/**
 * Port of stable fluid simulation using WebGL
 * From this project: https://github.com/PavelDoGreat/WebGL-Fluid-Simulation
 */

/** Container to center the canvas and make sure it stays square */
const PerfectCenter = styledTS(styled.div)`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const FluidGL: React.FunctionComponent<{ className?: string, canvaswidth: number, canvasheight: number }> = ({ className = "", canvaswidth = 600, canvasheight = 600}) => {
    const canvas_ref = React.useRef<HTMLCanvasElement | null>(null);
    const fluid_ref = React.useRef<FluidRender | null>(null);
    const animation_ref = React.useRef<number>(0);
    const frame_count = React.useRef<number>(50);
    const last_angle = React.useRef<number | null>(null);
    const last_hue = React.useRef<number | null>(null);

    const animationCallback = React.useCallback(() => {
        if (fluid_ref.current && canvas_ref.current) {
            fluid_ref.current.update(0.008);
            if (++frame_count.current === 201) {
                frame_count.current = 0;
            }
            const SIZE = 0.5;
            const MAGNITUDE = 300;
            const APPROACH_RADIUS = 250;
            const ANGLE_TOL = 30;
            const APPROACH_ANGLE_TOL = 45;
            const COLOR_TOL = 0.25;
            const X_MID = Math.round(canvas_ref.current.width / 2);
            const Y_MID = Math.round(canvas_ref.current.height / 2);
           if (frame_count.current !== 0 && frame_count.current % 50 === 0) {
                let next_angle: number;
                // generate a new splat vector, angle, but make sure it's not too close to the last splat vector angle
                do {
                    next_angle = Math.random() * 360;
                } while (last_angle.current !== null && Math.abs(next_angle - last_angle.current) < ANGLE_TOL);
                // do the same for a hue color
                let next_hue: number;
                do {
                    next_hue = Math.random();
                } while (last_hue.current !== null && Math.abs(next_hue - last_hue.current) < COLOR_TOL);
                // reset the last varibles
                last_angle.current = next_angle;
                last_hue.current = next_hue;
                // draw the splat vector!
                const rad = next_angle * (Math.PI / 180.0);
                fluid_ref.current.addVector(new SplatVector(
                    (next_angle + 180.0) + (Math.random() - 0.5) * APPROACH_ANGLE_TOL,
                    MAGNITUDE,
                    [Math.cos(rad) * APPROACH_RADIUS + X_MID, Math.sin(rad) * APPROACH_RADIUS + Y_MID],
                    HSVTools.HSVtoRGB({ h: next_hue, s: 1.0, v: 1.0 }), SIZE));
           }

            animation_ref.current = requestAnimationFrame(animationCallback);
        }
    }, [canvas_ref, fluid_ref, animation_ref, frame_count, last_angle, last_hue]);

    React.useEffect(() => {
        if (canvas_ref.current) {
            // get a config object for the fluid renderer
            const config = FluidRender.getDefaultConfig();
            config.SHADING = true;
            config.DENSITY_DISSIPATION = 0.99;
            config.SIM_RESOLUTION = 512;
            config.DYE_RESOLUTION = 1024;
            // set some options
            // TODO
            // setup the fluid renderer
            fluid_ref.current = new FluidRender(canvas_ref.current, config);
            console.log("Reconstuct!");
            // start it!
            animationCallback();
            // let react know we gotta clean up the animation
            return () => {
                cancelAnimationFrame(animation_ref.current);
                fluid_ref.current = null;
            };
        }
    }, [canvas_ref, fluid_ref, animationCallback]);

    useInsideViewport(canvas_ref, () => {
        if (fluid_ref.current) {
            fluid_ref.current.setPause(false);
            console.log("unpause");
            return () => fluid_ref.current && fluid_ref.current.setPause(true);
        }
    });

    return (
        <PerfectCenter className={className || undefined}>
            <canvas ref={canvas_ref} width={canvaswidth} height={canvasheight}></canvas>
        </PerfectCenter>
    );
};

export default FluidGL;