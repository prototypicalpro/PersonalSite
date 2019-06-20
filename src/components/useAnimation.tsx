import * as React from "react";

const useAnimation: (callback: () => void, cleanup?: () => void) => void = (callback, cleanup) => {
    const animation_ref = React.useRef<number>(0);

    React.useEffect(() => {
        const animation_callback = () => {
            // run the frame
            callback();
            // run the next handle
            animation_ref.current = requestAnimationFrame(animation_callback);
        };

        animation_callback();

        return () => {
            cancelAnimationFrame(animation_ref.current);
            if (cleanup) cleanup();
        };
    });
};

export default useAnimation;