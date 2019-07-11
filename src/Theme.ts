/**
 * Some constants denotiating uniform aspects of this website,
 * such as font size, color, etc.
 */
import { ReactComponent as WebLogo } from "./img/web.svg";
import { ReactComponent as EmbedLogo } from "./img/embedded.svg";
import { ReactComponent as CloudLogo } from "./img/cloud.svg";
import { ReactComponent as ProtoMask } from "./img/proto.svg";
import { ReactComponent as EmailLogo } from "./img/email.svg";
import { ReactComponent as GithubLogo } from "./img/github.svg";
import { ReactComponent as LinkedinLogo } from "./img/linkedin.svg";
import { ReactComponent as DownLogo } from "./img/down.svg";
import ReactLogo from "./img/react_logo.svg";
import StockImage from "./img/image.png";
import BackVideo from "./video/backvid.mp4";
import BackVideoSmall from "./video/backvidlq.mp4";
import BackThumb from "./img/backthumb.jpg";

const main_theme = {
    color: {
        title_background: "#EEEEEE",
        light_background: "#222831",
        light_overlay: "rgba(34, 40, 49, 0.75)",
        dark_background: "#393e46",
        logo_background: "#00adb5",
        logo_text: "#919191",
        none: "rgba(0,0,0,0)"
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
        }
    },
    logo: {
        size: {
            xsmall: "5vh",
            small: "10vh",
            medium: "12.5vh",
            large: "27.5vh",
        },
        url: {
            main: ReactLogo,
            stock: StockImage
        },
        svg: {
            cloud: CloudLogo,
            embedded: EmbedLogo,
            web: WebLogo,
            social: ReactLogo,
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

export default main_theme;