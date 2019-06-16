import * as React from "react";
const reactLogo = require("./../assets/img/react_logo.svg");
const stockPhoto = require("./../assets/img/image.png");
import styled, { ThemeProvider } from "styled-components";
import styledTS from "styled-components-ts";
import { string } from "prop-types";

/**
 * My psersonal website!
 * This file will handle top-level structure and styles, allowing each sub-component to fill
 * its own container.
 */

/** define a bunch of color constants that I can tweak later */
const main_theme = {
    color: {
        light_background: "#ECECEC",
        dark_background: "#C8C8C8",
        logo_background: "#C4C4C4",
        logo_text: "#919191",
    },
    font: {
        size: {
            xlarge: "125px",
            large: "56px",
            medium: "44px",
            small: "30px",
        },
        type: {
            header_footer: "'Open Sans', sans-serif",
            content: "'Roboto Slab', serif"
        }
    },
    logo: {
        size: {
            small: "100px",
            medium: "125px",
            large: "250px",
        },
        url: {
            main: reactLogo,
            cloud: reactLogo,
            embedded: reactLogo,
            web: reactLogo,
            social: reactLogo,
            stock: stockPhoto
        }
    }
};

const ContentContainer = styledTS<{ height: string, theme: typeof main_theme }>(styled.div)`
    display: grid;
    grid-template:
        [top_edge] ". . ." 10px [top_content] ". content ." auto [bot_content] ". . ." 10px [bot_edge]
        / [left_edge] minmax(20px, 1fr) [left_content] minmax(auto, 1080px) [right_content] minmax(20px, 1fr) [right_edge];

    width: 100%;
    background-color: ${ props => props.theme.color.light_background };

    .content {
        grid-area: content;
        height: ${ props => props.height };
    }

    .full {
        grid-row: top_edge / bottom_edge;
        grid-column: left_edge / right_edge;
    }
`;

const LogoElement = styledTS<{ imgname: string, size: string }>(styled.div)`
    // draw a grey circle for now
    width: ${ props => props.theme.logo.size[props.size] };
    height: ${ props => props.theme.logo.size[props.size] };
    background-image: url(${ props => props.theme.logo.url[props.imgname] });
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
`;

const TextElement = styledTS<{ size: string, type: string }>(styled.div)`
    font-family: ${ props => props.theme.font.type[props.type] };
    font-size: ${ props => props.theme.font.size[props.size] };
`;

const Header_Footer = styledTS(styled.div)`
    display: grid;
    grid-template-rows: [logo_top] 1fr [text_top] max-content [text_bot] 1fr [logo_bot];
    grid-template-columns: [logo_start] ${ props => props.theme.logo.size.small } [logo_end]
        repeat(3, min-content [text_border]);
    grid-gap: 0 50px;
    .logo {
        grid-row: logo_top / logo_bot;
        grid-column: logo_start / logo_end;
    }

    .text {
        grid-row: text_top / text_bot;
        white-space: nowrap;
    }
`;

const PerfectCenter = styledTS(styled.div)`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const MainText = styledTS(styled.div)`
    font-family: ${ props => props.theme.font.type.content };
    font-weight: bold;
    //white-space: nowrap;
    font-size: ${ props => props.theme.font.size.xlarge };
`;

export interface AppProps {
}

class MainPage extends React.Component<AppProps, undefined> {
    render() {
        return (
            <ThemeProvider theme={main_theme}>
                <div>
                    <ContentContainer height="85vh">
                        <PerfectCenter className="content" style={ { backgroundImage: `url(${main_theme.logo.url.stock})`, backgroundPosition: "center", backgroundSize: "cover" } }>
                            <MainText>Prototypical {"{"}P{"}"}ro</MainText>
                        </PerfectCenter>
                        <div className="content">
                            <Header_Footer>
                                <LogoElement imgname="main" size="small" className="logo"></LogoElement>
                                <TextElement type="header_footer" size="small" className="text">RESUME</TextElement>
                                <TextElement type="header_footer" size="small" className="text">GITHUB</TextElement>
                                <TextElement type="header_footer" size="small" className="text">CONTACT</TextElement>
                            </Header_Footer>
                        </div>
                    </ContentContainer>
                    <ContentContainer height="60vh">
                        <div className="content"></div>
                        <div className="full" style={ { backgroundColor: main_theme.color.dark_background } }></div>
                    </ContentContainer>
                    <ContentContainer height="70vh">
                        <div className="content"></div>
                    </ContentContainer>
                    <ContentContainer height="60vh">
                        <div className="content"></div>
                    </ContentContainer>
                    <ContentContainer height="20vh">
                        <div className="content"></div>
                    </ContentContainer>
                </div>
            </ThemeProvider>
        );
    }
}

export default MainPage;