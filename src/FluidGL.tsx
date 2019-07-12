import * as React from "react";
import { PerfectCenter } from "./Style";
import FluidRender from "./Fluid/FluidRender";
import HSVTools from "./Fluid/HSVTools";
import { useInView } from "react-intersection-observer";
import SplatVector from "./Fluid/FluidDraw";

/**
 * @brief The fluid demonstration present in the landing page of my website.
 *
 * This component controls the rendering and random fluid distortions of the
 * fluid simulation at the front of my website. The main bulk of the code
 * simply generates random SplatVectors based on some constants, and the rest
 * ensures that the fluid is operating correctly and only when it needs to be.
 *
 * SplatVectors are randomly generated in a radius around the center of the canvas,
 * pointed towards the center of the canvas. The color, angle approaching the center,
 * and position approaching the center are all random.
 */

/**
 * Contstant defining how long the splat vector should be proportional to the resolution of the canvas.
 * This value also defines the radius of the circle splat vectors approach from.
 */
const MAGNITUDE_FACTOR = 0.35;
/** Fixed size of every individual splat */
const SIZE = 0.5;
/** Number of splats to put down for a single splat vector */
const SPLATS_PER_VECTOR = 16;
/**
 * Watching two splat vectors come in from the same position is kinda boring, so this constant
 * ensures that the next splat vector is always ANGLE_TOL degrees away from the last splat.
 * This ensures that plenty of splat crossing always takes place. (Degrees).
 */
const ANGLE_TOL = 30;
/**
 * This is the maxiumum variation of angle approaching the center that a splat vector can have.
 * Too much and the splat shoots offscreen, too little and there's no variation (Degrees).
 */
const APPROACH_ANGLE_TOL = 45;
/**
 * The maximum variation on the Hue wheel in HSV that a splat vector can have from it's next splat vector.
 * This value ensures that the colors always create visually pleasing combinations, but still have an element
 * of randomness. (0-1).
 */
const COLOR_TOL = 0.4;
/** How often to generate a new splat vector, in frames */
const FRAME_COUNT = 50;

/**
 * @brief A fluid demonstration for my website
 * @param canvasres The width and height of the internal rendering canvas in pixels
 * @param canvassize The width and height of the displayed canvas in CSS values
 */
const FluidGL: React.FunctionComponent<{ className?: string, canvasres: number, canvassize: string }> = ({ className = "", canvasres, canvassize }) => {
    const canvas_ref = React.useRef<HTMLCanvasElement | null>(null);
    const fluid_ref = React.useRef<FluidRender | null>(null);
    const animation_id_ref = React.useRef<number | null>(null);
    const animation_callback_ref = React.useRef<(() => void) | null>(null);
    const frame_count = React.useRef<number>(1);
    const last_angle = React.useRef<number | null>(null);
    const last_hue = React.useRef<number | null>(null);

    /** Generate the next splat */
    const animation_callback = React.useCallback(() => {
            if (fluid_ref.current && canvas_ref.current) {
                // time step the fluid
                fluid_ref.current.update(0.008);
                // every fifty frames
                if (++frame_count.current === FRAME_COUNT) {
                    // set a bunch of useful constants
                    const MAGNITUDE = Math.round(canvasres * MAGNITUDE_FACTOR);
                    const MID = Math.round(canvasres * 0.5);
                    const APPROACH_RADIUS = MAGNITUDE;
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
                        HSVTools.HSVtoRGB({ h: next_hue, s: 1.0, v: 1.0 }),
                        SIZE,
                        SplatVector.DEFAULT_SPEED,
                        SPLATS_PER_VECTOR));
                    // reset frame counter
                    frame_count.current = 0;
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
        if (fluid_ref.current && canvas_ref.current) {
            canvas_ref.current.width = canvas_ref.current.clientWidth;
            canvas_ref.current.height = canvas_ref.current.clientHeight;
            fluid_ref.current.initFrameBuffers();
        }
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
            <canvas ref={ c => { canvas_ref.current = c; view_ref(c); } } width={canvasres} height={canvasres}
                style={{ width: canvassize, height: canvassize, backgroundColor: "black" }}/>
        </PerfectCenter>
    );
};

export default FluidGL;