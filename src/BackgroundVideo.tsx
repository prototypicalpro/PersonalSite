import * as React from "react";
import { useInView } from "react-intersection-observer";
import styled from "styled-components";

/** some styles to display a video and create a colored overlay */
const ContainerDiv = styled.div`
    position: relative;
`;

const OverlayDiv = styled.div<{ color: string }>`
    background-color: ${ props => props.color };
    width: 100%;
    height: 100%;
    opacity: 0.75;
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
const BackgroundVideo: React.FunctionComponent<{ videoSrcs: Array<{ url: string, mime: string }>, videoPoster: string, className: string, overlayColor?: string }> = React.memo(({videoSrcs, videoPoster, className, overlayColor = "rgba(0,0,0,0)"}) => {
    const videoRef = React.useRef<HTMLVideoElement | null>(null);
    const containerRef = React.useRef<HTMLDivElement | null>(null);
    const lastPromise = React.useRef<Promise<any> | null>(null);
    const [view_ref, inView] = useInView();

    React.useEffect(() => {
        if (videoRef.current) {
            if (inView && videoRef.current) {
                if (!videoRef.current.defaultMuted) videoRef.current.defaultMuted = true;
                if (!videoRef.current.muted) videoRef.current.muted = true;
                if (lastPromise.current) lastPromise.current.then(() => videoRef.current && videoRef.current.play() && undefined);
                else lastPromise.current = videoRef.current.play();
            }
            else {
                if (lastPromise.current) lastPromise.current.then(() => videoRef.current && videoRef.current.pause() && undefined);
                else videoRef.current && videoRef.current.pause();
            }
        }
    }, [videoRef, inView, videoSrcs, lastPromise]);

    const ref_callback = React.useCallback((v: HTMLVideoElement) => {
        videoRef.current = v; 
        if (v !== null) 
            v.defaultMuted = true; 
        view_ref(v);
    }, [view_ref, videoRef]);

    return (
        <ContainerDiv ref={containerRef} className={className}>
            <VideoStyle ref={ref_callback} loop muted={true} preload="auto" playsInline poster={videoPoster}>
                { videoSrcs.map((src, ind) => <source key={ind} src={src.url} type={src.mime} />) }
            </VideoStyle>
            <OverlayDiv color={overlayColor}></OverlayDiv>
        </ContainerDiv>
    );
});

export default React.memo(BackgroundVideo);