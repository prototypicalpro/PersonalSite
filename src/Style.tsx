import * as React from "react";
import styled, { css, createGlobalStyle } from "styled-components";
import styledTS from "styled-components-ts";
import main_theme from "./Theme";

/**
 * A collection of my styled used in MainPage.tsx
 *
 * All of these components depend on a theme provider, and the theme provided
 * by main_theme. This helped me quite a bit as the color and sizing of elements
 * is much more consistent. Most of these are implemented in terms of CSS Grid, and are a bit verbose as
 * a result.
 */


export const GlobalStyle = createGlobalStyle`
html {
  height: 100%;
  width: 100%;
}

#root {
    height: 100%
}

object {
	width: 100%;
	display: block;
	height: auto;
	position: relative;
	padding-top: 100%
}

svg {
	width: 100%;
	height: 100%;
	position: absolute;
	top: 0;
    left: 0;
}

body {
  height: 100%;
  margin: 0;
  font-family: 'Roboto Slab', serif;
  font-size: ${ props => props.theme.font.size.base };

  @media (max-width: ${ props => props.theme.screen.grid_collapse_width }) {
      font-size: ${ props => props.theme.font.size.base_mobile }
  }
}
`;

export const ContentContainer = styledTS<{ height: string, color: string, mobile_height?: string, theme: typeof main_theme }>(styled.div)`
    overflow: hidden;
    display: grid;
    grid-template:
        [top_edge] ${ props => props.theme.screen.top_bot_pad }
        [top_content] auto
        [bot_content] ${ props => props.theme.screen.top_bot_pad } [bot_edge]
        / [left_edge] minmax(${ props => props.theme.screen.side_pad }, 1fr)
        [left_content] minmax(auto, ${ props => props.theme.screen.content_width })
        [right_content] minmax(${ props => props.theme.screen.side_pad }, 1fr) [right_edge];

    width: 100%;
    height: ${ props => props.height };
    background-color: ${ props => props.color ? props.theme.color[props.color] : null };

    @media (max-width: ${ props => props.theme.screen.grid_collapse_width }) {
        height: ${ props => props.mobile_height };
    }

    & > .content {
        grid-area: top_content / left_content / bot_content / right_content;
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
    font-weight: bold;
    font-size: ${ props => props.theme.font.size.xlarge };
    color: #EFEFEF;
    z-index: 999;
`;

export const ResumeText = styledTS<{ theme: typeof main_theme }>(styled.div)`
    font-weight: 100;
    font-size: ${ props => props.theme.font.size.large };
    color: ${ props => props.theme.font.color.content };
    line-height: 1.35em;
    text-align: left;
    max-width: 22em;
`;

export const Mark = styledTS<{ theme: typeof main_theme }>(styled.mark)`
    background-color: ${ props => props.theme.font.color.accent };
    color: ${ props => props.theme.font.color.content };
    font-weight: bold;
    padding: 0 0.15em 0 0.15em;
`;

export const BodyElem = styledTS<{ theme: typeof main_theme, x?: number, y?: number, spanx?: number, spany?: number }>(styled.div)`
    ${ props => props.x ? css`grid-row: contentY ${ props => props.y } / span ${ props => props.spany ? props.spany : 1 };` : css`` }
    ${ props => props.y ? css`grid-column: contentX ${ props => props.x } / span ${ props => props.spanx ? props.spanx : 1 };` : css``}
`;

export const BodyGrid = styledTS<{ theme: typeof main_theme, col_count: number, col_gap: string, col_max: string }>(styled(BodyElem))`
    display: grid;
    grid-template-rows: repeat(2, min-content);
    grid-template-columns: repeat(${ props => props.col_count }, minmax(min-content, ${ props => props.col_max }));
    grid-auto-flow: column;
    row-gap: 7vmin;
    z-index: 100;
    column-gap: ${ props => props.col_gap };

    @media (max-width: ${ props => props.theme.screen.grid_collapse_width }) {
        column-gap: 0;
        grid-template-rows: repeat(${ props => props.col_count * 2 }, min-content);
        grid-template-columns: minmax(min-content, ${ props => props.col_max });
    }
`;

export const FlexCol = styledTS<{ theme: typeof main_theme, justify?: string, direction?: string, align?: string }>(styled(BodyElem))`
    display: flex;
    flex-direction: ${ props => props.direction || "column" };
    justify-content: ${ props => props.justify || "space-evenly" };
    align-items: ${ props => props.align || "center" };
    width: 100%;

    & > .grow {
        flex-grow: 1;
    }
`;

export const LogoElement = styledTS<{ imgname: string, size: string, theme: typeof main_theme }>(styled(BodyElem))`
    max-width: ${ props => props.theme.logo.size[props.size] };
    height: ${ props => props.theme.logo.size[props.size] };
    background-image: url(${ props => props.theme.logo.url[props.imgname] });
    background-position: center;
    background-size: contain;
    background-repeat: no-repeat;
    align-self: center;
`;

export const TextElement = styledTS<{ size: string, type: string, align?: string, text_align?: string, allow_wrap?: boolean, theme: typeof main_theme }>(styled(BodyElem))`
    font-size: ${ props => props.theme.font.size[props.size] };
    color: ${ props => props.theme.font.color[props.type] };
    text-align: ${ props => props.text_align ? props.text_align : "center" };
    align-self: ${ props => props.align ? props.align : "unset" };
    font-weight: 300;
    white-space: ${ props => props.allow_wrap ? "wrap" : "nowrap" };
    z-index: 100;
    text-decoration: none;
`;

export const HeaderFooterGrid = styledTS<{ theme: typeof main_theme }>(styled(BodyElem))`
    align-self: flex-start;
    display: grid;
    height: ${ props => props.theme.screen.header_footer };
    grid-template-rows: [contentY] 1fr [contentY] max-content [contentY] 1fr [contentY];
    grid-template-columns: [contentX] min-content 70px [contentX]
        repeat(3, min-content 50px [contentX]);
    align-items: center;
    z-index: 101;

    @media (max-width: ${ props => props.theme.screen.grid_collapse_width }) {
        grid-template-columns: [contentX] min-content [contentX];
        height: initial;

        & :not(:first-child){
            display: none;
        }
    }
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
    grid-template-columns: 1fr [left_content] 60vmin [right_content] 1fr;
    z-index: 100;

    & > .mask {
        grid-row: top_content / bot_content;
        grid-column: left_content / right_content;
    }

    & > .pack {
        background-color: ${ props => props.theme.color.light };
    }

    & > .pack.span {
        grid-column-start: span 3;
    }
`;

export const MaskSVG = styled.object`
    padding-top: 76.64%;
`;

export const SVGCSS = styledTS<{ theme: typeof main_theme, fixed_size: boolean }>(styled(BodyElem))`
    ${ props => props.fixed_size ? css`
        width: ${ props => props.theme.logo.size[props.size] };
        height: ${ props => props.theme.logo.size[props.size] };
    ` : css`
        max-width: ${ props => props.theme.logo.size[props.size] };
        max-height: ${ props => props.theme.logo.size[props.size] };
    `}
    align-self: center;
    z-index: 100;
`;

export const SimpleGrid = styledTS<{ theme: typeof main_theme, rows: number, cols: number, row_gap?: string, col_gap?: string }>(styled.div)`
    display: grid;
    justify-items: center;
    grid-template-rows: repeat(${ props => props.rows }, [contentY] max-content);
    grid-template-columns: repeat(${ props => props.cols }, [contentX] max-content);
    column-gap: ${ props => props.col_gap || 0 };
    row-gap: ${ props => props.row_gap || 0 }
`;

export const CreditLink = styledTS<{ theme: typeof main_theme }>(styled.a.attrs(props => ({
    rel: "noopener noreferrer",
    target: "_blank"
})))`
    color: ${ props => props.theme.color.accent };
`;