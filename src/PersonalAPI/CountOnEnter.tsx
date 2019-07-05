import * as React from "react";
import { CountUp } from "countup.js";
import { useInView } from "react-intersection-observer";

/**
 * Simple react component to access and display numbers from my API!
 */

 const CountOnEnter: React.FunctionComponent<{ end: number }> = ({ end }) => {
    const selfRef = React.useRef<HTMLDivElement | null>(null);
    const countupRef = React.useRef<CountUp | null>(null);
    const [view_ref, inView] = useInView({ triggerOnce: true });

    React.useEffect(() => {
        if (selfRef.current) countupRef.current = new CountUp(selfRef.current, 0, {
                duration: 2,
                // more options
            });
    }, [selfRef, countupRef]);

    React.useEffect(() => {
        if (countupRef.current && inView) {
            countupRef.current.update(end);
            countupRef.current.start();
            countupRef.current = null;
        }
    }, [inView, countupRef, end]);

    return (
        <div ref={(d) => { selfRef.current = d; view_ref(d); }}></div>
    );
 };

 export default CountOnEnter;