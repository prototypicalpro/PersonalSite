import * as React from "react";
import styled, { ThemeProvider, css, createGlobalStyle } from "styled-components";
import styledTS from "styled-components-ts";
import FluidFull from "./FluidGL";
import useEventListener from "@use-it/event-listener";
const reactLogo = require("./img/react_logo.svg");
const stockPhoto = require("./img/image.PNG");
const protoMask = require("./img/proto.png");


/**
 * My personal website!
 * This file will handle top-level structure and styles, allowing each sub-component to fill
 * its own container.
 */

/** define a bunch of color constants that I can tweak later */
const main_theme = {
    color: {
        light_background: "#ECECEC",
        dark_background: "#AEAEAE",
        logo_background: "#C4C4C4",
        logo_text: "#919191",
    },
    font: {
        size: {
            xlarge: "19vh",
            xlarge_num: 175,
            large: "5.6vh",
            large_num: 56,
            medium: "4.4vh",
            small: "3vh",
        },
        type: {
            header_footer: "'Open Sans', sans-serif",
            content: "'Roboto Slab', serif"
        }
    },
    logo: {
        size: {
            small: "10vh",
            medium: "12.5vh",
            large: "27.5vh",
        },
        url: {
            main: reactLogo,
            cloud: reactLogo,
            embedded: reactLogo,
            web: reactLogo,
            social: reactLogo,
            stock: stockPhoto
        }
    },
    screen: {
        content_width: "1440px",
        side_pad: "50px",
        top_bot_pad: "20px",
        header_footer: "15vh",
    }
};

const GlobalStyle = createGlobalStyle`
body {
  margin: 0;
}
`;

const ContentContainer = styledTS<{ height: string, color: string, theme: typeof main_theme }>(styled.div)`
    display: grid;
    grid-template:
        [top_edge] ". . ." ${ props => props.theme.screen.top_bot_pad }
        [top_content] ". content ." auto
        [bot_content] ". . ." ${ props => props.theme.screen.top_bot_pad } [bot_edge]
        / [left_edge] minmax(${ props => props.theme.screen.side_pad }, 1fr)
        [left_content] minmax(auto, ${ props => props.theme.screen.content_width })
        [right_content] minmax(${ props => props.theme.screen.side_pad }, 1fr) [right_edge];

    width: 100%;
    background-color: ${ props => props.color ? props.theme.color[props.color] : props.theme.color.light_background };

    & > .content {
        grid-area: content;
        height: ${ props => props.height };
    }

    & > .full {
        grid-row: top_edge / bot_edge;
        grid-column: left_edge / right_edge;
    }
`;

const PerfectCenter = styledTS<{ theme: typeof main_theme }>(styled.div)`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const MainText = styledTS<{ theme: typeof main_theme }>(styled.div)`
    font-family: ${ props => props.theme.font.type.content };
    font-weight: bold;
    font-size: ${ props => props.theme.font.size.xlarge };
`;

const ResumeText = styledTS<{ theme: typeof main_theme }>(styled.div)`
    font-family: ${ props => props.theme.font.type.content };
    font-weight: 100;
    font-size: ${ props => props.theme.font.size.large };
    line-height: 7.6vh;
    text-align: left;
    max-width: 22em;
`;

const BodyElem = styledTS<{ theme: typeof main_theme, x?: number, y?: number, spanx?: number, spany?: number }>(styled.div)`
    ${ props => props.x ? css`grid-row: contentY ${ props => props.y } / span ${ props => props.spany ? props.spany : 1 };` : css`` }
    ${ props => props.y ? css`grid-column: contentX ${ props => props.x } / span ${ props => props.spanx ? props.spanx : 1 };` : css``}
`;

const LogoElement = styledTS<{ imgname: string, size: string, theme: typeof main_theme }>(styled(BodyElem))`
    max-width: ${ props => props.theme.logo.size[props.size] };
    height: ${ props => props.theme.logo.size[props.size] };
    // background-image: url(${ props => props.theme.logo.url[props.imgname] });
    background-color: ${ props => props.theme.color.logo_background };
    border-radius: 50%;
    background-position: center;
    background-size: contain;
    background-repeat: no-repeat;
    align-self: center;
`;

const TextElement = styledTS<{ size: string, type: string, align?: string, text_align?: string, theme: typeof main_theme }>(styled(BodyElem))`
    font-family: ${ props => props.theme.font.type[props.type] };
    font-size: ${ props => props.theme.font.size[props.size] };
    text-align: ${ props => props.text_align ? props.text_align : "center" };
    align-self: ${ props => props.align ? props.align : "unset" };
    white-space: nowrap;
`;

const HeaderFooterGrid = styledTS<{ theme: typeof main_theme }>(styled(BodyElem))`
    display: grid;
    height: ${ props => props.theme.screen.header_footer };
    grid-template-rows: [contentY] 1fr [contentY] max-content [contentY] 1fr [contentY];
    grid-template-columns: [contentX] ${ props => props.theme.logo.size.small } [contentX]
        repeat(3, min-content [contentX]);
    grid-column-gap: 50px;
    align-items: center;
`;

const BodyGrid = styledTS<{ theme: typeof main_theme, col_count: number, col_gap: number, col_max: string, col_min: string }>(styled(BodyElem))`
    display: grid;
    grid-template-rows: [contentY] repeat(7, 1fr [contentY]) 1fr [contentY];
    grid-template-columns:
        [contentX] 1fr [contentX]
        minmax(0, ${ props => props.col_gap / 2 }px)
        ${props => props.col_count > 1 && css`
            repeat(${ props => props.col_count - 1 },
            [contentX] minmax(${ props => props.col_min }, ${ props => props.col_max })
            [contentX] minmax(0, ${ props => props.col_gap }px))
        `}
        [contentX] minmax(${ props => props.col_min }, ${ props => props.col_max })
        [contentX] minmax(0, ${ props => props.col_gap / 2 }px)
        [contentX] 1fr [contentX];
`;

const MaskImage = styledTS<{ theme: typeof main_theme, image: string }>(styled.div)`
    background-image: url(${ props => props.image});
    background-size: cover;
    background-position: center;
    z-index: 99;
`;

const MainPage: React.FunctionComponent = () => {
    // TODO: Set to however the size of the image is being calculated
    const [dimension, setDimension] = React.useState<number>(Math.min(window.innerWidth, window.innerHeight * 0.8));
    // check for window resize to update our canvas
    useEventListener("resize", () => {
        setDimension(Math.min(window.innerWidth, window.innerHeight * 0.8));
    });

    return (
        <ThemeProvider theme={main_theme}>
            <div>
                <GlobalStyle />
                <ContentContainer height="80vh" color="light_background">
                    <MaskImage className="full" image={protoMask}></MaskImage>
                    <FluidFull className="full" canvaswidth={dimension} canvasheight={dimension} ></FluidFull>
                    <div className="content"></div>
                </ContentContainer>
                <ContentContainer height="80vh" color="light_background">
                    <PerfectCenter className="content"
                        style={ { backgroundImage: `url(${main_theme.logo.url.stock})`, backgroundPosition: "center", backgroundSize: "cover" } }>
                        <MainText>Prototypical {"{"}P{"}"}ro</MainText>
                    </PerfectCenter>
                    <div className="content">
                        <HeaderFooterGrid>
                            <LogoElement x={1} y={1} spany={3} imgname="main" size="small"></LogoElement>
                            <TextElement x={2} y={2} type="header_footer" size="small">RESUME</TextElement>
                            <TextElement x={3} y={2} type="header_footer" size="small">GITHUB</TextElement>
                            <TextElement x={4} y={2} type="header_footer" size="small">CONTACT</TextElement>
                        </HeaderFooterGrid>
                    </div>
                </ContentContainer>
                <ContentContainer height="55vh" color="dark_background">
                    <BodyGrid className="content" col_count={3} col_gap={150} col_min={main_theme.logo.size.medium} col_max={main_theme.logo.size.large}>
                        <TextElement x={3} y={1} spanx={5} spany={2} type="content" size="medium">My name is Noah Koontz <br></br> and I build stuff</TextElement>
                        <LogoElement x={3} y={2} spany={6} imgname="cloud" size="large"></LogoElement>
                        <TextElement x={3} y={7} type="content" size="medium" align="end">Cloud</TextElement>
                        <LogoElement x={5} y={2} spany={6} imgname="embedded" size="large"></LogoElement>
                        <TextElement x={5} y={7} type="content" size="medium" align="end">Embedded</TextElement>
                        <LogoElement x={7} y={2} spany={6} imgname="web" size="large"></LogoElement>
                        <TextElement x={7} y={7} type="content" size="medium" align="end">Web</TextElement>
                    </BodyGrid>
                </ContentContainer>
                <ContentContainer height="65vh" color="light_background">
                    <div className="full" style={ { backgroundImage: `url(${main_theme.logo.url.stock})`, backgroundPosition: "center", backgroundSize: "cover" } }></div>
                    <BodyGrid className="content"
                        col_count={2}
                        col_gap={110}
                        col_min={(main_theme.font.size.large_num * 4).toString() + "px"}
                        col_max={(main_theme.font.size.xlarge_num * 4).toString() + "px"}>

                        <TextElement x={3} y={3} spany={3} type="content" align="center" size="xlarge">1212</TextElement>
                        <TextElement x={3} y={6} type="content" align="center" size="medium">Git Commits</TextElement>
                        <TextElement x={5} y={3} spany={3} type="content" align="center" size="xlarge">12123</TextElement>
                        <TextElement x={5} y={6} type="content" align="center" size="medium">Lines of Code</TextElement>
                    </BodyGrid>
                </ContentContainer>
                <ContentContainer height="55vh" color="dark_background">
                    <PerfectCenter className="content">
                        <ResumeText>I am a <b>maker</b> who enjoys the creative application of technology. I am a <b>hard worker</b> with an ability to turn ideas into reality. <b>Resourceful</b> and <b>motivated</b>, I have a track record of rapidly applying new concepts.</ResumeText>
                    </PerfectCenter>
                </ContentContainer>
                <ContentContainer height="65vh" color="light_background">
                <BodyGrid className="content" col_count={1} col_gap={0} col_min="110px" col_max="500px" style={{ backgroundImage: `url(${main_theme.logo.url.stock})`, backgroundPosition: "center", backgroundSize: "cover" }}>
                    <BodyGrid style={{ backgroundColor: main_theme.color.dark_background }} x={3} y={3} spany={3}
                        col_count={4} col_gap={20} col_min={main_theme.logo.size.small} col_max={main_theme.logo.size.small}>

                        <TextElement x={3} y={2} spanx={7} spany={2} type="content" align="center" size="small">Get In Touch</TextElement>
                        <LogoElement x={3} y={4} spany={4} imgname="web" size="small"></LogoElement>
                        <LogoElement x={5} y={4} spany={4} imgname="web" size="small"></LogoElement>
                        <LogoElement x={7} y={4} spany={4} imgname="web" size="small"></LogoElement>
                        <LogoElement x={9} y={4} spany={4} imgname="web" size="small"></LogoElement>
                    </BodyGrid>
                </BodyGrid>
                </ContentContainer>
                <ContentContainer height={main_theme.screen.header_footer} color="dark_background">
                    <div className="content">
                        <HeaderFooterGrid>
                            <LogoElement x={1} y={1} spany={3} imgname="main" size="small"></LogoElement>
                            <TextElement x={2} y={2} type="header_footer" size="small">©2019 Noah Koontz</TextElement>
                        </HeaderFooterGrid>
                    </div>
                </ContentContainer>
            </div>
        </ThemeProvider>
    );
}

export default MainPage;