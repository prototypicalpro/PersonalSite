import * as React from "react";
import { PerfectCenter } from "./Style";
import FluidRender from "./Fluid/FluidRender";
import HSVTools from "./Fluid/HSVTools";
import { useInView } from "react-intersection-observer";
import SplatVector from "./Fluid/FluidDraw";
import styled from "styled-components";

/**
 * Port of stable fluid simulation using WebGL
 * From this project: https://github.com/PavelDoGreat/WebGL-Fluid-Simulation
 */

const StyledCanvas = styled.canvas`
    width: ${ props => props.canvassize };
    height: ${ props => props.canvassize };
`;

const FluidGL: React.FunctionComponent<{ className?: string, canvasres: number, canvassize: string }> = ({ className = "", canvasres, canvassize }) => {
    const canvas_ref = React.useRef<HTMLCanvasElement | null>(null);
    const fluid_ref = React.useRef<FluidRender | null>(null);
    const animation_id_ref = React.useRef<number | null>(null);
    const animation_callback_ref = React.useRef<(() => void) | null>(null);
    const frame_count = React.useRef<number>(1);
    const last_angle = React.useRef<number | null>(null);
    const last_hue = React.useRef<number | null>(null);

    // generate an animation callback
    const animation_callback = React.useCallback(() => {
            if (fluid_ref.current && canvas_ref.current) {
                // time step the fluid
                fluid_ref.current.update(0.008);
                // update the frame counter
                if (++frame_count.current === 200) {
                    frame_count.current = 0;
                }
                // every fifty frames
                if (frame_count.current % 50 === 0) {
                    // set a bunch of useful constants
                    const SIZE = 0.5;
                    const MAGNITUDE = Math.round(canvasres * 0.35);
                    const APPROACH_RADIUS = MAGNITUDE;
                    const ANGLE_TOL = 30;
                    const APPROACH_ANGLE_TOL = 45;
                    const COLOR_TOL = 0.4;
                    const MID = Math.round(canvasres * 0.5);
                    // caLculate the next splats!
                    let next_angle: number;
                    // generate a new splat vector, angle, but make sure it's not too close to the last splat vector angle
                    do {
                        next_angle = Math.random() * 360;
                    } while (last_angle.current !== null && Math.abs(next_angle - last_angle.current) < ANGLE_TOL);
                    // generate the next hue color from moving a random amount from the last hue color
                    let next_hue = (last_hue.current || 0) + (Math.random() - 0.5) * COLOR_TOL;
                    if (next_hue > 1) next_hue -= 1;
                    else if (next_hue < 0) next_hue += 1;
                    // reset the last varibles
                    last_angle.current = next_angle;
                    last_hue.current = next_hue;
                    // draw the splat vector!
                    const rad = next_angle * (Math.PI / 180.0);
                    fluid_ref.current.addVector(new SplatVector(
                        (next_angle + 180.0) + (Math.random() - 0.5) * APPROACH_ANGLE_TOL,
                        MAGNITUDE,
                        [Math.cos(rad) * APPROACH_RADIUS + MID, Math.sin(rad) * APPROACH_RADIUS + MID],
                        HSVTools.HSVtoRGB({ h: next_hue, s: 1.0, v: 1.0 }), SIZE));
                }
                // next animation frame
                if (animation_callback_ref.current)
                    animation_id_ref.current = requestAnimationFrame(animation_callback_ref.current);
            }
        }, [canvas_ref, fluid_ref, animation_id_ref, animation_callback_ref, frame_count, last_angle, last_hue, canvasres]);
    // ensure the animation callback is updated when needed
    React.useEffect(() => { animation_callback_ref.current = animation_callback; }, [animation_callback_ref, animation_callback]);
    // add a resize handler to re-initialize the canvas when needed
    React.useEffect(() => {
        if (fluid_ref.current) fluid_ref.current.initFrameBuffers();
    }, [canvasres]);
    // setup the fluid object and shaders, and bind it to the canvas
    React.useEffect(() => {
        if (canvas_ref.current) {
            // get a config object for the fluid renderer
            const config = FluidRender.getDefaultConfig();
            config.SHADING = true;
            config.DENSITY_DISSIPATION = 0.99;
            config.SIM_RESOLUTION = 512;
            config.DYE_RESOLUTION = 1024;
            // setup the fluid renderer
            fluid_ref.current = new FluidRender(canvas_ref.current, config);
            console.log("Reconstuct!");
            // let react know we gotta clean up the fluid ref
            return () => {
                if (animation_id_ref.current) {
                    cancelAnimationFrame(animation_id_ref.current);
                    animation_id_ref.current = null;
                }
                fluid_ref.current = null;
            };
        }
    }, [canvas_ref, fluid_ref]);

    const [view_ref, inView] = useInView();
    // make sure we only are updating the fluid when we need to
    React.useEffect(() => {
        if (inView && !animation_id_ref.current && animation_callback_ref.current) {
            // start the animation
            animation_id_ref.current = requestAnimationFrame(animation_callback_ref.current);
        }
        else if (!inView && animation_id_ref.current) {
            // cancel the animation callback
            cancelAnimationFrame(animation_id_ref.current);
            animation_id_ref.current = null;
        }
    }, [inView, animation_callback_ref, animation_id_ref]);

    return (
        <PerfectCenter className={className || undefined}>
            <StyledCanvas canvassize={canvassize} ref={ c => { canvas_ref.current = c; view_ref(c); } } width={canvasres} height={canvasres} />
        </PerfectCenter>
    );
};

export default FluidGL;