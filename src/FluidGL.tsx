import * as React from "react";
import FluidRender from "./FluidRender";
import useInsideViewport from "./useInsideViewport";
const DitherImage = require("./img/LDR_RGB1_0.png");

/**
 * Port of stable fluid simulation using WebGL
 * From this project: https://github.com/PavelDoGreat/WebGL-Fluid-Simulation
 */

const FluidGL: React.FunctionComponent<{ className?: string, canvaswidth: number, canvasheight: number }> = ({ className = "", canvaswidth = 600, canvasheight = 600}) => {
    const canvas_ref = React.useRef<HTMLCanvasElement | null>(null);
    const fluid_ref = React.useRef<FluidRender | null>(null);
    const animation_ref = React.useRef<number>(0);
    const number = React.useRef<number>(50);

    const animationCallback = () => {
        if (fluid_ref.current && canvas_ref.current) {
            fluid_ref.current.update(0.008);
            if (++number.current === 100) {
                number.current = 0;
            }

            if (number.current < 25) {
                const color = FluidRender.generateColor();
                color.r *= 10.0;
                color.g *= 10.0;
                color.b *= 10.0;
                fluid_ref.current.splat(10 + number.current * 20, 400, 500, 0, color, .8);
                fluid_ref.current.splat(canvas_ref.current.width - (10 + number.current * 20), 400, -500, 0, color, .8);
                fluid_ref.current.splat(canvas_ref.current.width / 2, number.current * 18, 0, 500, color, .8);
                fluid_ref.current.splat(canvas_ref.current.width / 2, canvas_ref.current.height - number.current * 18, 0, -500, color, .8);
            }
            animation_ref.current = requestAnimationFrame(animationCallback);
        }
    };

    useInsideViewport(canvas_ref, () => {
        if (canvas_ref.current) {
            // get a config object for the fluid renderer
            const config = FluidRender.getDefaultConfig();
            config.BLOOM = false;
            config.SHADING = false;
            config.DENSITY_DISSIPATION = 0.99;
            config.SIM_RESOLUTION = 512;
            config.DYE_RESOLUTION = 1024;
            // set some options
            // TODO
            // setup the fluid renderer
            fluid_ref.current = new FluidRender(canvas_ref.current, config, DitherImage);
            console.log("Reconstuct!");
            // start it!
            animationCallback();
            // let react know we gotta clean up the animation
            return () => {
                cancelAnimationFrame(animation_ref.current);
                fluid_ref.current = null;
            };
        }
    });

    return (
        <div className={className || undefined}>
            <canvas ref={canvas_ref} width={canvaswidth} height={canvasheight}></canvas>
        </div>
    );
};

export default FluidGL;