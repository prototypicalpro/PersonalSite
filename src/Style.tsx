/**
 * This file contains all the CSS components for my one-page site.
 * This will eventually be converted to static CSS as styled-components seems
 * to garner me less benifit that I had hoped.
 */

import * as React from "react";
import styled, { css, createGlobalStyle } from "styled-components";
import styledTS from "styled-components-ts";
import main_theme from "./Theme";

export const GlobalStyle = createGlobalStyle`
body {
  margin: 0;
}
`;

export const ContentContainer = styledTS<{ height: string, color: string, theme: typeof main_theme }>(styled.div)`
    overflow: hidden;
    display: grid;
    grid-template:
        [top_edge] ". . ." ${ props => props.theme.screen.top_bot_pad }
        [top_content] ". content ." auto
        [bot_content] ". . ." ${ props => props.theme.screen.top_bot_pad } [bot_edge]
        / [left_edge] minmax(${ props => props.theme.screen.side_pad }, 1fr)
        [left_content] minmax(auto, ${ props => props.theme.screen.content_width })
        [right_content] minmax(${ props => props.theme.screen.side_pad }, 1fr) [right_edge];

    width: 100%;
    height: ${ props => props.height };
    background-color: ${ props => props.color ? props.theme.color[props.color] : null };

    & > .content {
        grid-area: content;
    }

    & > .full {
        grid-row: top_edge / bot_edge;
        grid-column: left_edge / right_edge;
    }
`;

export const PerfectCenter = styledTS<{ theme: typeof main_theme }>(styled.div)`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

export const MainText = styledTS<{ theme: typeof main_theme }>(styled.div)`
    font-family: ${ props => props.theme.font.type.content };
    font-weight: bold;
    font-size: ${ props => props.theme.font.size.xlarge };
    color: #EFEFEF;
    z-index: 999;
`;

export const ResumeText = styledTS<{ theme: typeof main_theme }>(styled.div)`
    font-family: ${ props => props.theme.font.type.content };
    font-weight: 100;
    font-size: ${ props => props.theme.font.size.large };
    color: ${ props => props.theme.font.color.content };
    line-height: 8vh;
    text-align: left;
    max-width: 22em;
`;

export const Mark = styledTS<{ theme: typeof main_theme }>(styled.mark)`
    background-color: ${ props => props.theme.color.logo_background };
    color: ${ props => props.theme.font.color.content };
    font-weight: bold;
    padding: 0 0.15em 0 0.15em;
`;

export const BodyElem = styledTS<{ theme: typeof main_theme, x?: number, y?: number, spanx?: number, spany?: number }>(styled.div)`
    ${ props => props.x ? css`grid-row: contentY ${ props => props.y } / span ${ props => props.spany ? props.spany : 1 };` : css`` }
    ${ props => props.y ? css`grid-column: contentX ${ props => props.x } / span ${ props => props.spanx ? props.spanx : 1 };` : css``}
`;

export const LogoElement = styledTS<{ imgname: string, size: string, theme: typeof main_theme }>(styled(BodyElem))`
    max-width: ${ props => props.theme.logo.size[props.size] };
    height: ${ props => props.theme.logo.size[props.size] };
    background-image: url(${ props => props.theme.logo.url[props.imgname] });
    // background-color: ${ props => props.theme.color.logo_background };
    background-position: center;
    background-size: contain;
    background-repeat: no-repeat;
    align-self: center;
`;

export const TextElement = styledTS<{ size: string, type: string, align?: string, text_align?: string, theme: typeof main_theme }>(styled(BodyElem))`
    font-family: ${ props => props.theme.font.type[props.type] };
    font-size: ${ props => props.theme.font.size[props.size] };
    color: ${ props => props.theme.font.color[props.type] };
    text-align: ${ props => props.text_align ? props.text_align : "center" };
    align-self: ${ props => props.align ? props.align : "unset" };
    font-weight: 300;
    white-space: nowrap;
    z-index: 100;
    text-decoration: none;
`;

export const HeaderFooterGrid = styledTS<{ theme: typeof main_theme }>(styled(BodyElem))`
    display: grid;
    height: ${ props => props.theme.screen.header_footer };
    grid-template-rows: [contentY] 1fr [contentY] max-content [contentY] 1fr [contentY];
    grid-template-columns: [contentX] min-content 70px [contentX]
        repeat(3, min-content 50px [contentX]);
    align-items: center;
`;


export const BodyGrid = styledTS<{ theme: typeof main_theme, col_count: number, col_gap: number, col_max: string, col_min: string }>(styled(BodyElem))`
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

const MaskGridBase: React.FunctionComponent<{ className?: string, children?: any }> = ({ className, children }) => {
    return (
        <div className={ className }>
            <div className="pack span"></div>
            <div className="pack"></div>
            <div className="pack"></div>
            <div className="pack span"></div>
            { children }
        </div>
    );
};

export const MaskGrid = styledTS<{ theme: typeof main_theme }>(styled(MaskGridBase))`
    display: grid;
    grid-template-rows: 1fr [top_content] min-content [bot_content] 1fr;
    grid-template-columns: 1fr [left_content] 55vmin [right_content] 1fr;
    z-index: 100;

    & > .mask {
        grid-row: top_content / bot_content;
        grid-column: left_content / right_content;
    }

    & > .pack {
        background-color: ${ props => props.theme.color.title_background };
    }

    & > .pack.span {
        grid-column-start: span 3;
    }
`;

export const MaskSVG = styledTS<{ theme: typeof main_theme }>(styled.div)`
    // TODO: something here
    // width: 50vmin;
    align-self: center;
`;

export const SVGCSS = styledTS<{ theme: typeof main_theme }>(styled(BodyElem))`
    max-width: ${ props => props.theme.logo.size[props.size] };
    max-height: ${ props => props.theme.logo.size[props.size] };
    align-self: center;
    z-index: 100;
`;