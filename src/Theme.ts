/**
 * Some constants denotiating uniform aspects of this website,
 * such as font size, color, etc.
 */
import { ReactComponent as WebLogo } from "./img/web.svg";
import { ReactComponent as EmbedLogo } from "./img/embedded.svg";
import { ReactComponent as CloudLogo } from "./img/cloud.svg";
import ReactLogo from "./img/react_logo.svg";
import StockImage from "./img/image.png";

const main_theme = {
    color: {
        // light_background: "#ECECEC",
        // dark_background: "#AEAEAE",
        // logo_background: "#C4C4C4",
        light_background: "#222831",
        dark_background: "#393e46",
        logo_background: "#00adb5",
        logo_text: "#919191",
    },
    font: {
        size: {
            xlarge: "17vh",
            xlarge_num: Math.round(window.innerHeight * .17),
            large: "5.6vh",
            large_num: Math.round(window.innerHeight * .056),
            medium: "4.4vh",
            small: "3vh",
        },
        type: {
            header_footer: "'Open Sans', sans-serif",
            wordmark: "'Roboto Slab', serif",
            content: "'Roboto Slab', serif"
        },
        color: {
            header_footer: "#222831",
            wordmark: "#222831",
            content: "#EEEEEE",
        }
    },
    logo: {
        size: {
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
        }
    },
    screen: {
        content_width: "1200px",
        side_pad: "50px",
        top_bot_pad: "15px",
        header_footer: "12vh",
    }
};

export default main_theme;