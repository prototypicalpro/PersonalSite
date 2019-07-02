import HSVTypes from "./HSVTypes";

/*eslint no-unused-expressions: "off"*/
/*eslint no-sequences: "off"*/
export default class HSVTools {
    static HSVtoRGB (c: HSVTypes.HSVColor): HSVTypes.RGBColor {
        const {h, s, v} = c;
        let i, f, p, q, t;
        i = Math.floor(h * 6);
        f = h * 6 - i;
        p = v * (1 - s);
        q = v * (1 - f * s);
        t = v * (1 - (1 - f) * s);

        switch (i % 6) {
            case 0: return { r: v, g: t, b: p };
            case 1: return { r: q, g: v, b: p };
            case 2: return { r: p, g: v, b: t };
            case 3: return { r: p, g: q, b: v };
            case 4: return { r: t, g: p, b: v };
            case 5: return { r: v, g: p, b: q };
            default: return { r: 0, g: 0, b: 0 };
        }
    }

    static generateColor (): HSVTypes.RGBColor {
        let c = HSVTools.HSVtoRGB({ h: Math.random(), s: 1.0, v: 1.0 });
        c.r *= 0.15;
        c.g *= 0.15;
        c.b *= 0.15;
        return c;
    }
}