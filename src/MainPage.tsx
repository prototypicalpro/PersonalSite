import * as React from "react";
import AnchorLink from "react-anchor-link-smooth-scroll";
import { ThemeProvider } from "styled-components";
import useEventListener from "@use-it/event-listener";
import * as Style from "./Style";
import FluidGL from "./FluidGL";
import CountOnEnter from "./CountOnEnter";
import main_theme from "./Theme";
import { useAPI, IGithubRet } from "./PersonalAPI/useAPI";
import BackgroundVideo from "./BackgroundVideo";

/**
 * My personal website!
 * This file will handle top-level structure and styles, allowing each sub-component to fill
 * its own container.
 */

 // the API result as of 3/21/2020
 const BACKUP_COMMIT_COUNT = 1354;
 const BACKUP_HOURS_COUNT = 6360;

 const MainPage: React.FunctionComponent = () => {
    const [dimension, setDimension] = React.useState<number>(0);
    const [width, setWidth] = React.useState<number>(0);
    const [stats, setStats] = React.useState<IGithubRet | null>();

    // create a callback for the event listener
    const dim_callback = React.useCallback(() => {
        setWidth(window.innerWidth);
        setDimension(Math.min(window.innerWidth * 0.9, window.innerHeight * 0.9));
    }, [setDimension]);
    // check for window resize to update our canvas
    useEventListener("resize", dim_callback);
    // and run it once on startup jsut to be safe
    React.useEffect(dim_callback, [dim_callback]);
    // query my personal API for my impressive numbers
    useAPI("githubcount", React.useCallback((data) => setStats(data), [setStats]));
    // build the website
    return (
        <ThemeProvider theme={ main_theme }>
            <div style={{ height: "100%" }}>
                <Style.GlobalStyle />
                <Style.ContentContainer id="landing" height="100%">
                    <FluidGL className="full" canvasres={ dimension } canvassize="90vmin" />
                    <Style.MaskGrid className="full">
                        <Style.MaskSVG className="mask">
                            <main_theme.logo.svg.mask aria-label="{P}"/>
                        </Style.MaskSVG>
                    </Style.MaskGrid>
                    <Style.FlexCol className="content">
                        <Style.HeaderFooterGrid>
                            <Style.TextElement x={1} y={2} type="wordmark" size="small">
                                <b>Prototypical Pro</b>
                            </Style.TextElement>
                            <Style.TextElement as="a" rel="noopener" target="_blank"
                                href="https://github.com/prototypicalpro"
                                aria-label="View projects I have worked with on GitHub"
                                x={2} y={2} type="header" size="small">Projects</Style.TextElement>
                            <Style.TextElement as="a" rel="noopener" target="_blank"
                                href="https://drive.google.com/open?id=1BFq08qwXKwoWRhGwUvSGmqYUZuWOVjtb"
                                aria-label="Download a copy of my resume"
                                x={3} y={2} type="header" size="small">Resume</Style.TextElement>
                            <Style.TextElement as={ AnchorLink } href="#contact"
                                aria-label="Scroll down to links with my contact information"
                                x={4} y={2} type="header" size="small">Contact</Style.TextElement>
                        </Style.HeaderFooterGrid>
                        <Style.FlexCol className="grow" justify="flex-end">
                            <Style.SVGCSS fixed_size="true" as={ AnchorLink } href="#intro"
                                aria-label="Scroll to the next section"
                                offset={ () => Math.round(window.innerWidth > window.innerHeight ? window.innerHeight * 0.15 : 0) }
                                size="xsmall">
                                <object><main_theme.logo.svg.down fill={ main_theme.color.dark } /></object>
                            </Style.SVGCSS>
                        </Style.FlexCol>
                    </Style.FlexCol>
                </Style.ContentContainer>
                <Style.ContentContainer id="intro" height="70%" mobile_height="152.5vh" color="medium">
                    <Style.PerfectCenter className="content">
                        <Style.SimpleGrid rows={2} cols={1} row_gap="7vmin">
                            <Style.TextElement type="content" size="medium" align="center">
                                My name is <Style.Mark>Noah Koontz</Style.Mark><br></br> and I build stuff.
                            </Style.TextElement>
                            <Style.BodyGrid col_count={3} col_gap="5vmin" col_max={main_theme.logo.size.large}>
                                <Style.SVGCSS size="large" as="object" title="Cloud">
                                    <main_theme.logo.svg.cloud fill={ main_theme.color.accent } />
                                </Style.SVGCSS>
                                <Style.TextElement type="content" size="medium" align="end">Cloud</Style.TextElement>
                                <Style.SVGCSS size="large" as="object" title="Embedded">
                                    <main_theme.logo.svg.embedded fill={ main_theme.color.accent } />
                                </Style.SVGCSS>
                                <Style.TextElement type="content" size="medium" align="end">Embedded</Style.TextElement>
                                <Style.SVGCSS size="large" as="object" title="Web">
                                    <main_theme.logo.svg.web fill={ main_theme.color.accent } />
                                </Style.SVGCSS>
                                <Style.TextElement type="content" size="medium" align="end">Web</Style.TextElement>
                            </Style.BodyGrid>
                        </Style.SimpleGrid>
                    </Style.PerfectCenter>
                </Style.ContentContainer>
                <Style.ContentContainer id="numbers" height="80%" mobile_height="120vh">
                    <BackgroundVideo className="full"
                        videoSrcs={ width > 720 ? main_theme.video.middle.vid_srcs : main_theme.video.middle.small_vid_srcs }
                        videoPoster={ main_theme.video.middle.thumb } overlayColor={ main_theme.color.dark } />
                    <Style.PerfectCenter className="content">
                        <Style.BodyGrid col_count={3} col_gap="0"
                            col_max={ (main_theme.font.size.xlarge_num * 4).toString() + "px" }>
                            <Style.TextElement type="content" align="center" size="xlarge">
                                <CountOnEnter end={stats ? stats.totalCommitsByMe : BACKUP_COMMIT_COUNT} />
                            </Style.TextElement>
                            <Style.TextElement type="content" align="center" size="medium">Git Commits</Style.TextElement>
                            <div></div>
                            <div></div>
                            <Style.TextElement type="content" align="center" size="xlarge">
                                <CountOnEnter end={stats ? stats.totalHoursByMe : BACKUP_HOURS_COUNT} />
                            </Style.TextElement>
                            <Style.TextElement type="content" align="center" size="medium">Hours</Style.TextElement>
                        </Style.BodyGrid>
                    </Style.PerfectCenter>
                </Style.ContentContainer>
                <Style.ContentContainer id="text" height="70%" mobile_height="152.5vh" color="medium">
                    <Style.PerfectCenter className="content">
                        <Style.ResumeText>
                            I am <Style.Mark>maker</Style.Mark> who enjoys the creative
                            application of technology. I am a <Style.Mark>hard worker</Style.Mark> with
                            an ability to turn ideas into
                            reality. <Style.Mark>Resourceful</Style.Mark> and <Style.Mark>motivated</Style.Mark>,
                            I have a track record of rapidly applying new concepts.
                        </Style.ResumeText>
                    </Style.PerfectCenter>
                </Style.ContentContainer>
                <Style.ContentContainer id="contact" height="60%" color="dark">
                    <Style.PerfectCenter className="content" >
                        <Style.SimpleGrid rows={2} cols={3} col_gap="20px" row_gap="15px">
                            <Style.TextElement x={1} y={1} spanx={3} type="content" align="center" size="medium">
                                Get In Touch
                            </Style.TextElement>
                            <Style.SVGCSS size="small" fixed_size="true"
                                as="a" href="mailto:noah@koontzs.com" rel="noopener noreferrer"
                                aria-label="Send me an email" >
                                <object><main_theme.logo.svg.mail fill={ main_theme.color.accent } /></object>
                            </Style.SVGCSS>
                            <Style.SVGCSS size="small" fixed_size="true"
                                as="a" href="https://www.linkedin.com/in/prototypicalpro" rel="noopener" target="_blank"
                                aria-label="Follow me on LinkedIn">
                                <object><main_theme.logo.svg.linkedin fill={ main_theme.color.accent } /></object>
                            </Style.SVGCSS>
                            <Style.SVGCSS size="small" fixed_size="true"
                                as="a" href="https://github.com/prototypicalpro" rel="noopener" target="_blank"
                                aria-label="Check out projects I have worked with on GitHub">
                                <object><main_theme.logo.svg.github fill={ main_theme.color.accent } /></object>
                            </Style.SVGCSS>
                        </Style.SimpleGrid>
                    </Style.PerfectCenter>
                </Style.ContentContainer>
                <Style.ContentContainer height={ main_theme.screen.header_footer } mobile_height="16%" color="medium">
                    <Style.FlexCol className="content" direction="row" justify="flex-start">
                        <Style.TextElement allow_wrap text_align="left" type="content" size="xsmall">
                            <Style.CreditLink href="https://fonts.google.com/specimen/Roboto+Slab">
                                Roboto Slab font by Christian Robertson
                            </Style.CreditLink> from Google Fonts, licenced under&nbsp;
                            <Style.CreditLink href="http://www.apache.org/licenses/LICENSE-2.0">
                                Apache 2.0
                            </Style.CreditLink>.&nbsp;
                            <Style.CreditLink href="https://thenounproject.com/jagaviranane/">
                                Web logo by Logan
                            </Style.CreditLink>,&nbsp;
                            <Style.CreditLink href="https://thenounproject.com/counloucon/">
                                embedded and cloud logo by counloucon
                            </Style.CreditLink>, from Noun Project licenced under&nbsp;
                            <Style.CreditLink href="https://creativecommons.org/licenses/by/3.0/us/legalcode">
                                Creative Commons CCBY.
                            </Style.CreditLink>&nbsp;
                            <Style.CreditLink href="https://github.com/PavelDoGreat/WebGL-Fluid-Simulation">
                                Fluid simulation by PavelDoGreat
                            </Style.CreditLink>, modified by Noah Koontz, licenced under MIT.
                        </Style.TextElement>
                    </Style.FlexCol>
                </Style.ContentContainer>
            </div>
        </ThemeProvider>
    );
};

export default MainPage;