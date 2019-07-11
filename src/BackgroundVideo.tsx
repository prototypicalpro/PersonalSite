import * as React from "react";
import { useInView } from "react-intersection-observer";
import styled from "styled-components";
import styledTS from "styled-components-ts";

/** some styles to display a video and create a colored overlay */
const ContainerDiv = styled.div`
    position: relative;
`;

const OverlayDiv = styledTS<{ color: string }>(styled.div)`
    background-color: ${ props => props.color };
    width: 100%;
    height: 100%;
`;

const VideoStyle = styled.video`
    overflow: hidden;
    position: absolute;
    z-index: -1000;
    // centering hack that never gets old
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    min-width: 100%;
    min-height: 100%;
    width: auto;
    height: auto;
`;

/** Element to play a video in the background of an element */
const BackgroundVideo: React.FunctionComponent<{ videoSrc: string, videoPoster: string, className: string, overlayColor?: string }> = React.memo(({videoSrc, videoPoster, className, overlayColor = "rgba(0,0,0,0)"}) => {
    const videoRef = React.useRef<HTMLVideoElement | null>(null);
    const containerRef = React.useRef<HTMLDivElement | null>(null);
    const lastPromise = React.useRef<Promise<any> | null>(null);
    const [view_ref, inView] = useInView();

    React.useEffect(() => {
        if (videoRef.current) {
            if (inView && videoRef.current) {
                if (!videoRef.current.muted) videoRef.current.muted = true;
                if (lastPromise.current) lastPromise.current.then(() => videoRef.current && videoRef.current.play() && undefined);
                else lastPromise.current = videoRef.current.play();
            }
            else {
                if (lastPromise.current) lastPromise.current.then(() => videoRef.current && videoRef.current.pause() && undefined);
                else videoRef.current.pause();
            }
        }
    }, [videoRef, inView, videoSrc, lastPromise]);

    return (
        <ContainerDiv ref={containerRef} className={className}>
            <VideoStyle ref={(v) => { videoRef.current = v; view_ref(v); }} loop muted={1} preload="auto" playsInline src={videoSrc} poster={videoPoster}/>
            <OverlayDiv color={overlayColor}></OverlayDiv>
        </ContainerDiv>
    );
});

export default BackgroundVideo;