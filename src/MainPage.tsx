import * as React from "react";
import ScrollableAnchor, { configureAnchors } from "react-scrollable-anchor";
import { ThemeProvider } from "styled-components";
import useEventListener from "@use-it/event-listener";
import * as Style from "./Style";
import FluidGL from "./FluidGL";
import CountOnEnter from "./PersonalAPI/CountOnEnter";
import main_theme from "./Theme";
import { useAPI, IGithubRet } from "./PersonalAPI/useAPI";
import BackgroundVideo from "./BackgroundVideo";

/**
 * My personal website!
 * This file will handle top-level structure and styles, allowing each sub-component to fill
 * its own container.
 */

 // the API result as of 7/3/2019
 const BACKUP_COMMIT_COUNT = 919;
 const BACKUP_HOURS_COUNT = 4319;

const MainPage: React.FunctionComponent = () => {
    const [dimension, setDimension] = React.useState<number>(0);
    const [width, setWidth] = React.useState<number>(0);
    const [stats, setStats] = React.useState<IGithubRet | null>();

    // create a callback for the event listener
    const dim_callback = React.useCallback(() => {
        setWidth(window.innerWidth);
        setDimension(Math.min(window.innerWidth * 0.8, window.innerHeight * 0.8));
    }, [setDimension]);
    // check for window resize to update our canvas
    useEventListener("resize", dim_callback);
    // and run it once on startup jsut to be safe
    React.useEffect(dim_callback, [dim_callback]);
    // query my personal API for my impressive numbers
    useAPI("githubcount", React.useCallback((data) => setStats(data), [setStats]));
    // configure the scroll anchors
    React.useEffect(() => configureAnchors({
        offset: -Math.round(window.innerHeight * 0.175),
        scrollDuration: 800,
        keepLastAnchorHash: true,
    }), []);
    // build the website
    return (
        <ThemeProvider theme={main_theme}>
            <div>
                <Style.GlobalStyle />
                <ScrollableAnchor id="landing">
                    <Style.ContentContainer height="100vh">
                        <FluidGL className="full" canvasres={dimension} canvassize="80vmin" />
                        <Style.MaskGrid className="full">
                            <Style.MaskSVG as={main_theme.logo.svg.mask} className="mask" />
                        </Style.MaskGrid>
                        <Style.BodyGrid className="content"
                            col_count={3}
                            col_gap={0}
                            col_min={main_theme.logo.size.xsmall}
                            col_max={main_theme.logo.size.xsmall} >

                            <Style.HeaderFooterGrid x={1} y={1} spanx={9}>
                                <Style.TextElement x={1} y={2} type="wordmark" size="small"><b>Prototypical Pro</b></Style.TextElement>
                                <Style.TextElement as={"a"} rel="noopener noreferrer" target="_blank" x={2} y={2} type="header_footer" size="small">Resume</Style.TextElement>
                                <Style.TextElement as={"a"} rel="noopener noreferrer" target="_blank" href="https://github.com/prototypicalpro" x={3} y={2} type="header_footer" size="small">Github</Style.TextElement>
                                <Style.TextElement as={"a"} rel="noopener noreferrer" href="#contact" x={4} y={2} type="header_footer" size="small">Contact</Style.TextElement>
                            </Style.HeaderFooterGrid>
                            <Style.SVGCSS as={"a"} href="#intro" x={5} y={8} size="xsmall">
                                <main_theme.logo.svg.down fill={main_theme.color.dark_background} />
                            </Style.SVGCSS>
                        </Style.BodyGrid>
                    </Style.ContentContainer>
                </ScrollableAnchor>
                <ScrollableAnchor id="intro">
                    <Style.ContentContainer height="70vh" color="dark_background">
                        <Style.BodyGrid className="content" col_count={3} col_gap={150} col_min={main_theme.logo.size.medium} col_max={main_theme.logo.size.large}>
                            <Style.TextElement x={3} y={1} spanx={5} spany={2} type="content" size="medium" align="center">My name is <Style.Mark>Noah Koontz</Style.Mark><br></br> and I build stuff.</Style.TextElement>
                            <Style.SVGCSS x={3} y={2} spany={6} size="large" as={main_theme.logo.svg["cloud"]} fill={main_theme.color.logo_background} title="Cloud" />
                            <Style.TextElement x={3} y={7} type="content" size="medium" align="end">Cloud</Style.TextElement>
                            <Style.SVGCSS x={5} y={2} spany={6} size="large" as={main_theme.logo.svg["embedded"]} fill={main_theme.color.logo_background} title="Embedded" />
                            <Style.TextElement x={5} y={7} type="content" size="medium" align="end">Embedded</Style.TextElement>
                            <Style.SVGCSS x={7} y={2} spany={6} size="large" as={main_theme.logo.svg["web"]} fill={main_theme.color.logo_background} title="Web" />
                            <Style.TextElement x={7} y={7} type="content" size="medium" align="end">Web</Style.TextElement>
                        </Style.BodyGrid>
                    </Style.ContentContainer>
                </ScrollableAnchor>
                <ScrollableAnchor id="numbers">
                    <Style.ContentContainer height="80vh">
                        <BackgroundVideo className="full" videoSrc={width > 720 ? main_theme.video.middle.vid : main_theme.video.middle.small_vid} videoPoster={main_theme.video.middle.thumb} overlayColor={main_theme.color.light_overlay} />
                        <Style.BodyGrid className="content"
                            col_count={2}
                            col_gap={110}
                            col_min={(main_theme.font.size.large_num * 4).toString() + "px"}
                            col_max={(main_theme.font.size.xlarge_num * 4).toString() + "px"}>

                            <Style.TextElement x={3} y={3} spany={3} type="content" align="center" size="xlarge">
                                <CountOnEnter end={stats ? stats.totalCommitsByMe : BACKUP_COMMIT_COUNT} />
                            </Style.TextElement>
                            <Style.TextElement x={3} y={6} type="content" align="center" size="medium">Git Commits</Style.TextElement>
                            <Style.TextElement x={5} y={3} spany={3} type="content" align="center" size="xlarge">
                                <CountOnEnter end={stats ? stats.totalHoursByMe : BACKUP_HOURS_COUNT} />
                            </Style.TextElement>
                            <Style.TextElement x={5} y={6} type="content" align="center" size="medium">Hours</Style.TextElement>
                        </Style.BodyGrid>
                    </Style.ContentContainer>
                </ScrollableAnchor>
                <ScrollableAnchor id="text">
                    <Style.ContentContainer height="70vh" color="dark_background">
                        <Style.PerfectCenter className="content">
                            <Style.ResumeText>
                                I am a <Style.Mark>maker</Style.Mark> who enjoys the creative
                                application of technology. I am a <Style.Mark>hard worker</Style.Mark> with
                                an ability to turn ideas into
                                reality. <Style.Mark>Resourceful</Style.Mark> and <Style.Mark>motivated</Style.Mark>,
                                I have a track record of rapidly applying new concepts.</Style.ResumeText>
                        </Style.PerfectCenter>
                    </Style.ContentContainer>
                </ScrollableAnchor>
                <ScrollableAnchor id="contact">
                    <Style.ContentContainer height="60vh" color="light_background">
                        <Style.BodyGrid className="content" col_count={1} col_gap={0} col_min="110px" col_max="500px" >
                            <Style.BodyGrid x={3} y={3} spany={3}
                                col_count={3} col_gap={20} col_min={main_theme.logo.size.small} col_max={main_theme.logo.size.small}>

                                <Style.TextElement x={3} y={1} spanx={5} spany={2} type="content" align="center" size="medium">Get In Touch</Style.TextElement>
                                <Style.SVGCSS as={"a"} href="mailto:noah@koontzs.com" rel="noopener noreferrer" x={3} y={3} spany={5} size="small">
                                    <main_theme.logo.svg.mail fill={main_theme.color.logo_background} />
                                </Style.SVGCSS>
                                <Style.SVGCSS as={"a"} href="https://www.linkedin.com/in/prototypicalpro" rel="noopener noreferrer" target="_blank" x={5} y={3} spany={5} size="small">
                                    <main_theme.logo.svg.linkedin fill={main_theme.color.logo_background} />
                                </Style.SVGCSS>
                                <Style.SVGCSS as={"a"} href="https://github.com/prototypicalpro" rel="noopener noreferrer" target="_blank" x={7} y={3} spany={5} size="small">
                                    <main_theme.logo.svg.github fill={main_theme.color.logo_background} />
                                </Style.SVGCSS>
                            </Style.BodyGrid>
                        </Style.BodyGrid>
                    </Style.ContentContainer>
                </ScrollableAnchor>
                <Style.ContentContainer height={main_theme.screen.header_footer} color="dark_background">
                    <div className="content">
                        <Style.HeaderFooterGrid>
                            <Style.LogoElement x={1} y={1} spany={3} imgname="main" size="small" />
                            <Style.TextElement x={2} y={2} type="header_footer" size="xsmall">©2019 Noah Koontz. Roboto Slab font by Christian Robertson from Google Fonts, licenced under Apache 2.0 (TODO link). Web logo created by Logan, embedded and cloud logo created by counloucon, from Noun Project licenced under Creative Commons CCBY. Fluid simulation by PavelDoGreat, modified by Noah Koontz, licenced under MIT</Style.TextElement>
                        </Style.HeaderFooterGrid>
                    </div>
                </Style.ContentContainer>
            </div>
        </ThemeProvider>
    );
};

export default MainPage;