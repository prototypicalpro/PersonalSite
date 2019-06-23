import * as React from "react";
import useEventListener from "@use-it/event-listener";

/**
 * Simple hook for detecting if an element is inside the viewport or not
 */

function getIsInside(elem: HTMLElement) {
    const rect = elem.getBoundingClientRect();
    return (rect.top >= 0 && rect.top <= window.innerHeight)
                || (rect.bottom > 0 && rect.bottom <= window.innerHeight);
}

const useInsideViewport: (element: React.MutableRefObject<HTMLElement | null>, insidecallback: () => (() => void) | void) => void = (element, insidecallback) => {
    const [isInside, setIsInside] = React.useState<boolean | null>(null);
    const insideCallbackRef = React.useRef<(() => void) | null>(null);

    useEventListener("scroll", () => {
        if (element.current) setIsInside(getIsInside(element.current));
    });

    React.useEffect(() => {
        if (element.current) {
            // if we haven't detected ever, do the first check and run this function again
            if (isInside === null) setIsInside(getIsInside(element.current));
            // else if it's inside run the callback
            else if (isInside) insideCallbackRef.current = insidecallback() || null;
            // else run the cleanup if it exists
            else if (insideCallbackRef.current) {
                insideCallbackRef.current();
                insideCallbackRef.current = null;
            }
            // tell react to run the cleanup if this component disapears
            return insideCallbackRef.current || undefined;
        }
    }, [isInside, insidecallback, element]);
};

export default useInsideViewport;