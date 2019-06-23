import * as React from "react";
import FluidRender from "./FluidRender";
import useInsideViewport from "./useInsideViewport";
import { SplatVector, SplatVectorState } from "./FluidDraw";
const DitherImage = require("./img/LDR_RGB1_0.png");

/**
 * Port of stable fluid simulation using WebGL
 * From this project: https://github.com/PavelDoGreat/WebGL-Fluid-Simulation
 */

function getColor() {
    const color = FluidRender.generateColor();
    color.r *= 8.0;
    color.g *= 8.0;
    color.b *= 8.0;
    return color;
}

const FluidGL: React.FunctionComponent<{ className?: string, canvaswidth: number, canvasheight: number }> = ({ className = "", canvaswidth = 600, canvasheight = 600}) => {
    const canvas_ref = React.useRef<HTMLCanvasElement | null>(null);
    const fluid_ref = React.useRef<FluidRender | null>(null);
    const animation_ref = React.useRef<number>(0);
    const number = React.useRef<number>(50);
    const vectors = React.useRef<Array<SplatVector>>([new SplatVector(45, 300), new SplatVector(135, 300), new SplatVector(225, 300), new SplatVector(315, 300)]);

    const animationCallback = () => {
        if (fluid_ref.current && canvas_ref.current) {
            fluid_ref.current.update(0.008);
            if (++number.current === 201) {
                number.current = 0;
            }
            /*
            if (number.current < 25) {
                const color = FluidRender.generateColor();
                color.r *= 10.0;
                color.g *= 10.0;
                color.b *= 10.0;
                // fluid_ref.current.splat(10 + number.current * 20, 400, 500, 0, color, .8);
                // fluid_ref.current.splat(canvas_ref.current.width - (10 + number.current * 20), 400, -500, 0, color, .8);
                // fluid_ref.current.splat(canvas_ref.current.width / 2, number.current * 18, 0, 500, color, .8);
                // fluid_ref.current.splat(canvas_ref.current.width / 2, canvas_ref.current.height - number.current * 18, 0, -500, color, .8);
            }
            */
            const SIZE = 0.2;
            const X_MID = Math.round(canvas_ref.current.width / 2);
            const Y_MID = Math.round(canvas_ref.current.height / 2);
            const X_LOW = X_MID - 250;
            const X_HIGH = X_MID + 250;
            const Y_LOW = Y_MID - 250;
            const Y_HIGH = Y_MID + 250;
            if (number.current === 50) fluid_ref.current.addVector(new SplatVectorState(vectors.current[0], [X_LOW, Y_LOW], getColor(), SIZE));
            else if (number.current === 100) fluid_ref.current.addVector(new SplatVectorState(vectors.current[1], [X_HIGH, Y_LOW], getColor(), SIZE));
            else if (number.current === 150) fluid_ref.current.addVector(new SplatVectorState(vectors.current[2], [X_HIGH, Y_HIGH], getColor(), SIZE));
            else if (number.current === 200) fluid_ref.current.addVector(new SplatVectorState(vectors.current[3], [X_LOW, Y_HIGH], getColor(), SIZE));

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