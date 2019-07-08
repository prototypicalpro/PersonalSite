import * as React from "react";
import * as Style from "./Style";
import FluidGL from "./FluidGL";
import CountOnEnter from "./PersonalAPI/CountOnEnter";
import useEventListener from "@use-it/event-listener";
import main_theme from "./Theme";
import { ThemeProvider } from "styled-components";
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
    const [stats, setStats] = React.useState<IGithubRet | null>();

    // create a callback for the event listener
    const dim_callback = React.useCallback(() => {
        setDimension(Math.min(window.innerWidth * 0.8, window.innerHeight * 0.8));
    }, [setDimension]);
    // check for window resize to update our canvas
    useEventListener("resize", dim_callback);
    // and run it once on startup jsut to be safe
    React.useEffect(dim_callback, [dim_callback]);
    // query my personal API for my impressive numbers
    useAPI("githubcount", React.useCallback((data) => setStats(data), [setStats]));
    // build the website
    return (
        <ThemeProvider theme={main_theme}>
            <div>
                <Style.GlobalStyle />
                <Style.ContentContainer height="100vh" color="light_background">
                    <FluidGL className="full" canvasres={dimension} canvassize="80vmin" />
                    <Style.MaskGrid className="full" style={{ zIndex: 100 }}>
                        <Style.MaskSVG as={main_theme.logo.svg.mask} className="mask" />
                    </Style.MaskGrid>
                    <div className="content" style={{ zIndex: 100 }}>
                        <Style.HeaderFooterGrid>
                            <Style.TextElement x={1} y={2} type="wordmark" size="small"><b>Prototypical Pro</b></Style.TextElement>
                            <Style.TextElement x={2} y={2} type="header_footer" size="small">Resume</Style.TextElement>
                            <Style.TextElement x={3} y={2} type="header_footer" size="small">Github</Style.TextElement>
                            <Style.TextElement x={4} y={2} type="header_footer" size="small">Contact</Style.TextElement>
                        </Style.HeaderFooterGrid>
                    </div>
                </Style.ContentContainer>
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
                <Style.ContentContainer height="80vh" color="none">
                    <BackgroundVideo className="full" videoSrc={window.innerWidth > 720 ? main_theme.video.middle.vid : main_theme.video.middle.small_vid} videoPoster={main_theme.video.middle.thumb} overlayColor={main_theme.color.light_overlay} />
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
                <Style.ContentContainer height="60vh" color="light_background">
                <Style.BodyGrid className="content" col_count={1} col_gap={0} col_min="110px" col_max="500px" >
                    <Style.BodyGrid x={3} y={3} spany={3}
                        col_count={4} col_gap={20} col_min={main_theme.logo.size.small} col_max={main_theme.logo.size.small}>

                        <Style.TextElement x={3} y={2} spanx={7} spany={2} type="content" align="center" size="small">Get In Touch</Style.TextElement>
                        <Style.LogoElement x={3} y={4} spany={4} imgname="web" size="small" />
                        <Style.LogoElement x={5} y={4} spany={4} imgname="web" size="small" />
                        <Style.LogoElement x={7} y={4} spany={4} imgname="web" size="small" />
                        <Style.LogoElement x={9} y={4} spany={4} imgname="web" size="small" />
                    </Style.BodyGrid>
                </Style.BodyGrid>
                </Style.ContentContainer>
                <Style.ContentContainer height={main_theme.screen.header_footer} color="header_footer">
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