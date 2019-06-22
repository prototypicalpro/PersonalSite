import * as React from "react";
import FluidRender from "./FluidRender";
const DitherImage = require("./img/LDR_RGB1_0.png");

/**
 * Port of stable fluid simulation using WebGL
 * From this project: https://github.com/PavelDoGreat/WebGL-Fluid-Simulation
 */

const FluidGL: React.FunctionComponent<{ className: string }> = ({ className = "" }) => {
    const canvas_ref = React.useRef<HTMLCanvasElement | null>(null);
    const fluid_ref = React.useRef<FluidRender | null>(null);
    const animation_ref = React.useRef<number>(0);
    const number = React.useRef<number>(0);

    const animationCallback = () => {
        if (fluid_ref.current && canvas_ref.current) {
            fluid_ref.current.update(0.016);
            if (++number.current === 200) {
                number.current = 0;
            }

            if (number.current < 30) {
                const color = FluidRender.generateColor();
                color.r *= 10.0;
                color.g *= 10.0;
                color.b *= 10.0;
                fluid_ref.current.splat(10 + number.current * 20, 400, 500, 0, color);
                fluid_ref.current.splat(canvas_ref.current.width - (10 + number.current * 20), 400, -500, 0, color);
            }
            // fluid_ref.current.splat(100, 100, 100, 100, { r: 255, g:  255, b: 255});
            animation_ref.current = requestAnimationFrame(animationCallback);
        }
    };

    React.useEffect(() => {
        if (canvas_ref.current) {
            // setup the canvas
            canvas_ref.current.width = canvas_ref.current.clientWidth;
            canvas_ref.current.height = canvas_ref.current.clientHeight;
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
            // add some splats
            fluid_ref.current.randomSplats(5);
            // start it!
            animationCallback();
            // let react know we gotta clean up the animation
            return () => {
                cancelAnimationFrame(animation_ref.current);
                fluid_ref.current = null;
            };
        }
    }, [canvas_ref.current]);

    return (
        <canvas ref={canvas_ref} className={className} width={1440} height={700}></canvas>
    );
};

export default FluidGL;