import * as React from "react";
import { CountUp } from "countup.js";
import useInsideViewport from "../useInsideViewport";

/**
 * Simple react component to access and display numbers from my API!
 */

 const CountOnEnter: React.FunctionComponent<{ end: number }> = ({ end }) => {
    const selfRef = React.useRef<HTMLDivElement>(null);
    const countupRef = React.useRef<CountUp | null>(null);

    React.useEffect(() => {
        if (selfRef.current) countupRef.current = new CountUp(selfRef.current, 0, {
                duration: 2,
                // more options
            });
    }, [selfRef, countupRef]);

    useInsideViewport(selfRef, () => {
        if (countupRef.current) {
            countupRef.current.update(end);
            countupRef.current.start();
            countupRef.current = null;
        }
    });

    return (
        <div ref={selfRef}></div>
    );
 };

 export default CountOnEnter;