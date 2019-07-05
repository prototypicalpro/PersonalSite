import * as React from "react";
import useInsideViewport from "./useInsideViewport";
import styled from "styled-components";
import styledTS from "styled-components-ts";

/** some styles to display a video and create a colored overlay */
const ContainerDiv = styled.div`
    overflow: hidden;
`;

const OverlayDiv = styledTS<{ color: string }>(styled.div)`
    width: 100%;
    height: 100%;
    background-color: ${ props => props.color };
    position: absolute;
    z-index: 100;
`;

const VideoStyle = styled.video`
    position: absolute;
`;

/** Element to play a video in the background of an element */
const BackgroundVideo: React.FunctionComponent<{ videoSrc: string, videoPoster: string, className: string, overlayColor?: string, }> = ({videoSrc, videoPoster, className, overlayColor = "rgba(0,0,0,0)"}) => {
    const videoRef = React.useRef<HTMLVideoElement | null>(null);
    const containerRef = React.useRef<HTMLDivElement | null>(null);

    useInsideViewport(containerRef, () => {
        if (containerRef.current && videoRef.current) {
            videoRef.current.play();
            return () => videoRef.current && videoRef.current.pause();
        }
    });

    return (
        <ContainerDiv ref={containerRef} className={className}>
            <OverlayDiv color={overlayColor} />
            <VideoStyle ref={videoRef} loop={true} muted={true} preload="auto" playsInline={true} src={videoSrc} poster={videoPoster}/>
        </ContainerDiv>
    );
};

export default BackgroundVideo;