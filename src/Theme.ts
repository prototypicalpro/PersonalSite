import { ReactComponent as WebLogo } from "./img/web.svg";
import { ReactComponent as EmbedLogo } from "./img/embedded.svg";
import { ReactComponent as CloudLogo } from "./img/cloud.svg";
import { ReactComponent as ProtoMask } from "./img/proto.svg";
import { ReactComponent as EmailLogo } from "./img/email.svg";
import { ReactComponent as GithubLogo } from "./img/github.svg";
import { ReactComponent as LinkedinLogo } from "./img/linkedin.svg";
import { ReactComponent as DownLogo } from "./img/down.svg";
import BackVideo from "./video/backvid.mp4";
import BackVideoSmall from "./video/backvidlq.mp4";
import BackThumb from "./img/backthumb.jpg";

/**
 * This file stores some important constants dictating universal constants
 * for my personal website. This includes font sizes, side margins, colors,
 * logo sizes, etc.
 *
 * Some constants (row margins in some cases) have been left in Style.tsx
 * as CSS constants. If you are adjusting constants in here and not getting
 * the results you need, check that the CSS is not defined in it's own
 * component rather than this theme.
 */

const MainTheme = {
    color: {
        dark: "#222831",
        medium: "#393e46",
        light: "#EEEEEE",
        accent: "#00adb5",
    },
    font: {
        size: {
            base_mobile: "7vw",
            base: "35px",
            xlarge: "4.5em",
            xlarge_num: Math.round(window.innerHeight * .17),
            large: "1.5em",
            medium: "1em",
            small: "0.75em",
            xsmall: "0.35em",
        },
        color: {
            header: "#222831",
            wordmark: "#222831",
            content: "#EEEEEE",
            accent: "#00adb5"
        }
    },
    logo: {
        size: {
            xsmall: "5vh",
            small: "10vh",
            medium: "12.5vh",
            large: "27.5vh",
        },
        svg: {
            cloud: CloudLogo,
            embedded: EmbedLogo,
            web: WebLogo,
            mask: ProtoMask,
            mail: EmailLogo,
            github: GithubLogo,
            linkedin: LinkedinLogo,
            down: DownLogo,
        }
    },
    screen: {
        content_width: "1200px",
        side_pad: "7vmin",
        top_bot_pad: "20px",
        header_footer: "13%",
        grid_collapse_width: "100vh"
    },
    video: {
        middle: {
            vid: BackVideo,
            small_vid: BackVideoSmall,
            thumb: BackThumb
        }
    }
};

export default MainTheme;