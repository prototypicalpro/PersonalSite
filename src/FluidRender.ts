import getShaders from "./FluidShaders";

/*eslint no-unused-expressions: "off"*/

/**
 * Port of stable fluid simulation using WebGL
 * From this project: https://github.com/PavelDoGreat/WebGL-Fluid-Simulation
 */

interface IGLExtentsions {
    formatRGBA;
    formatRG;
    formatR;
    halfFloatTexType;
    supportLinearFiltering;
}

function HSVtoRGB (h, s, v) {
    let r, g, b, i, f, p, q, t;
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);

    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }

    return {
        r,
        g,
        b
    };
}

function isMobile (): boolean {
    return /Mobi|Android/i.test(navigator.userAgent);
}

class GLProgram {
    uniforms: any;
    program: WebGLProgram;

    constructor ( gl: WebGL2RenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader) {
        this.program = gl.createProgram() as WebGLProgram;
        this.uniforms = {};

        gl.attachShader(this.program, vertexShader);
        gl.attachShader(this.program, fragmentShader);
        gl.linkProgram(this.program);

        if (!gl.getProgramParameter(this.program, gl.LINK_STATUS))
            throw gl.getProgramInfoLog(this.program);

        const uniformCount = gl.getProgramParameter(this.program, gl.ACTIVE_UNIFORMS);
        for (let i = 0; i < uniformCount; i++) {
            const uniformName = (gl.getActiveUniform(this.program, i) as WebGLActiveInfo).name;
            this.uniforms[uniformName] = gl.getUniformLocation(this.program, uniformName);
        }
    }

    bind (gl: WebGL2RenderingContext) {
        gl.useProgram(this.program);
    }
}

class FluidRender {
    private readonly canvas: HTMLCanvasElement;
    private readonly gl: WebGL2RenderingContext;
    private readonly ext: IGLExtentsions;
    private readonly config;
    private readonly ditheringTexture;

    private readonly clearProgram: GLProgram;
    private readonly colorProgram: GLProgram;
    private readonly backgroundProgram: GLProgram;
    private readonly displayProgram: GLProgram;
    private readonly displayBloomProgram: GLProgram;
    private readonly displayShadingProgram: GLProgram;
    private readonly displayBloomShadingProgram: GLProgram;
    private readonly bloomPrefilterProgram: GLProgram;
    private readonly bloomBlurProgram: GLProgram;
    private readonly bloomFinalProgram: GLProgram;
    private readonly splatProgram: GLProgram;
    private readonly advectionProgram: GLProgram;
    private readonly divergenceProgram: GLProgram;
    private readonly curlProgram: GLProgram;
    private readonly vorticityProgram: GLProgram;
    private readonly pressureProgram: GLProgram;
    private readonly gradientSubtractProgram: GLProgram;

    private bloomFramebuffers: Array<any> = [];
    private simWidth;
    private simHeight;
    private dyeWidth;
    private dyeHeight;
    private density;
    private velocity;
    private divergence;
    private curl;
    private pressure;
    private bloom;

    private readonly blit: (destination: WebGLFramebuffer | null) => void;

    private static readonly DEFAULT_CONF = {
        SIM_RESOLUTION: 128,
        DYE_RESOLUTION: 512,
        DENSITY_DISSIPATION: 0.97,
        VELOCITY_DISSIPATION: 0.98,
        PRESSURE_DISSIPATION: 0.8,
        PRESSURE_ITERATIONS: 20,
        CURL: 30,
        SPLAT_RADIUS: 0.5,
        SHADING: true,
        COLORFUL: true,
        PAUSED: false,
        BACK_COLOR: { r: 0, g: 0, b: 0 },
        TRANSPARENT: false,
        BLOOM: true,
        BLOOM_ITERATIONS: 8,
        BLOOM_RESOLUTION: 256,
        BLOOM_INTENSITY: 0.8,
        BLOOM_THRESHOLD: 0.6,
        BLOOM_SOFT_KNEE: 0.7
    };

    static getDefaultConfig(): typeof FluidRender.DEFAULT_CONF {
        return Object.assign({}, FluidRender.DEFAULT_CONF);
    }

    constructor(canvas: HTMLCanvasElement, config: typeof FluidRender.DEFAULT_CONF, text_url: string) {
        this.canvas = canvas;
        // get the GL context from the canvas, and read support information
        const { gl, ext } = FluidRender.getWebGLContext(canvas);
        this.gl = gl;
        // set the extensions and config data
        this.ext = ext;
        this.config = config;
        // modify the config for platform specific things
        if (isMobile())
            this.config.SHADING = false;

        if (!this.ext.supportLinearFiltering) {
            this.config.SHADING = false;
            this.config.BLOOM = false;
        }

        // process the shaders
        const {
            baseVertexShader,
            clearShader,
            colorShader,
            backgroundShader,
            displayShader,
            displayBloomShader,
            displayShadingShader,
            displayBloomShadingShader,
            bloomPrefilterShader,
            bloomBlurShader,
            bloomFinalShader,
            splatShader,
            advectionShader,
            advectionManualFilteringShader,
            divergenceShader,
            curlShader,
            vorticityShader,
            pressureShader,
            gradientSubtractShader
        } = getShaders(this.gl);

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.gl.createBuffer());
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), this.gl.STATIC_DRAW);
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.gl.createBuffer());
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), this.gl.STATIC_DRAW);
        this.gl.vertexAttribPointer(0, 2, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(0);

        this.blit = (destination: WebGLFramebuffer | null) => {
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, destination);
            this.gl.drawElements(this.gl.TRIANGLES, 6, this.gl.UNSIGNED_SHORT, 0);
        };

        // load the image texture for dithering
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, 1, 1, 0, gl.RGB, gl.UNSIGNED_BYTE, new Uint8Array([255, 255, 255]));

        this.ditheringTexture = {
            texture,
            width: 1,
            height: 1,
            attach: ((id) => {
                this.gl.activeTexture(this.gl.TEXTURE0 + id);
                this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
                return id;
            }).bind(this)
        };

        const image = new Image();
        image.onload = (() => {
            this.ditheringTexture.width = image.width;
            this.ditheringTexture.height = image.height;
            this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
            this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGB, this.gl.RGB, this.gl.UNSIGNED_BYTE, image);
        }).bind(this);
        image.src = text_url;

        this.clearProgram               = new GLProgram(this.gl, baseVertexShader, clearShader);
        this.colorProgram               = new GLProgram(this.gl, baseVertexShader, colorShader);
        this.backgroundProgram          = new GLProgram(this.gl, baseVertexShader, backgroundShader);
        this.displayProgram             = new GLProgram(this.gl, baseVertexShader, displayShader);
        this.displayBloomProgram        = new GLProgram(this.gl, baseVertexShader, displayBloomShader);
        this.displayShadingProgram      = new GLProgram(this.gl, baseVertexShader, displayShadingShader);
        this.displayBloomShadingProgram = new GLProgram(this.gl, baseVertexShader, displayBloomShadingShader);
        this.bloomPrefilterProgram      = new GLProgram(this.gl, baseVertexShader, bloomPrefilterShader);
        this.bloomBlurProgram           = new GLProgram(this.gl, baseVertexShader, bloomBlurShader);
        this.bloomFinalProgram          = new GLProgram(this.gl, baseVertexShader, bloomFinalShader);
        this.splatProgram               = new GLProgram(this.gl, baseVertexShader, splatShader);
        this.advectionProgram           = new GLProgram(this.gl, baseVertexShader, ext.supportLinearFiltering ? advectionShader : advectionManualFilteringShader);
        this.divergenceProgram          = new GLProgram(this.gl, baseVertexShader, divergenceShader);
        this.curlProgram                = new GLProgram(this.gl, baseVertexShader, curlShader);
        this.vorticityProgram           = new GLProgram(this.gl, baseVertexShader, vorticityShader);
        this.pressureProgram            = new GLProgram(this.gl, baseVertexShader, pressureShader);
        this.gradientSubtractProgram     = new GLProgram(this.gl, baseVertexShader, gradientSubtractShader);

        // init framebuffers
        this.initFrameBuffers();
    }

    private initFrameBuffers() {
        let simRes = this.getResolution(this.config.SIM_RESOLUTION);
        let dyeRes = this.getResolution(this.config.DYE_RESOLUTION);

        this.simWidth  = simRes.width;
        this.simHeight = simRes.height;
        this.dyeWidth  = dyeRes.width;
        this.dyeHeight = dyeRes.height;

        const texType = this.ext.halfFloatTexType;
        const rgba    = this.ext.formatRGBA;
        const rg      = this.ext.formatRG;
        const r       = this.ext.formatR;
        const filtering = this.ext.supportLinearFiltering ? this.gl.LINEAR : this.gl.NEAREST;

        if (this.density == null)
            this.density = this.createDoubleFBO(this.dyeWidth, this.dyeHeight, rgba.internalFormat, rgba.format, texType, filtering);
        else
            this.density = this.resizeDoubleFBO(this.density, this.dyeWidth, this.dyeHeight, rgba.internalFormat, rgba.format, texType, filtering);

        if (this.velocity == null)
            this.velocity = this.createDoubleFBO(this.simWidth, this.simHeight, rg.internalFormat, rg.format, texType, filtering);
        else
            this.velocity = this.resizeDoubleFBO(this.velocity, this.simWidth, this.simHeight, rg.internalFormat, rg.format, texType, filtering);

        this.divergence = this.createFBO      (this.simWidth, this.simHeight, r.internalFormat, r.format, texType, this.gl.NEAREST);
        this.curl       = this.createFBO      (this.simWidth, this.simHeight, r.internalFormat, r.format, texType, this.gl.NEAREST);
        this.pressure   = this.createDoubleFBO(this.simWidth, this.simHeight, r.internalFormat, r.format, texType, this.gl.NEAREST);

        this.initBloomFramebuffers();
    }

   private initBloomFramebuffers () {
        let res = this.getResolution(this.config.BLOOM_RESOLUTION);

        const texType = this.ext.halfFloatTexType;
        const rgba = this.ext.formatRGBA;
        const filtering = this.ext.supportLinearFiltering ? this.gl.LINEAR : this.gl.NEAREST;

        this.bloom = this.createFBO(res.width, res.height, rgba.internalFormat, rgba.format, texType, filtering);

        this.bloomFramebuffers = [];
        for (let i = 0; i < this.config.BLOOM_ITERATIONS; i++) {
            let width = res.width >> (i + 1);
            let height = res.height >> (i + 1);

            if (width < 2 || height < 2) break;

            let fbo = this.createFBO(width, height, rgba.internalFormat, rgba.format, texType, filtering);
            this.bloomFramebuffers.push(fbo);
        }
    }

    private getResolution (resolution) {
        let aspectRatio = this.gl.drawingBufferWidth / this.gl.drawingBufferHeight;
        if (aspectRatio < 1)
            aspectRatio = 1.0 / aspectRatio;

        let max = Math.round(resolution * aspectRatio);
        let min = Math.round(resolution);

        if (this.gl.drawingBufferWidth > this.gl.drawingBufferHeight)
            return { width: max, height: min };
        else
            return { width: min, height: max };
    }

    private createFBO (w: number, h: number, internalFormat: number, format: number, type: number, param: number) {
        this.gl.activeTexture(this.gl.TEXTURE0);
        let texture = this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, param);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, param);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, internalFormat, w, h, 0, format, type, null);

        let fbo = this.gl.createFramebuffer();
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, fbo);
        this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_2D, texture, 0);
        this.gl.viewport(0, 0, w, h);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        return {
            texture: texture as WebGLTexture,
            fbo: fbo as WebGLFramebuffer,
            width: w,
            height: h,
            attach: ((id) => {
                this.gl.activeTexture(this.gl.TEXTURE0 + id);
                this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
                return id;
            }).bind(this)
        };
    }

    private createDoubleFBO (w: number, h: number, internalFormat: number, format: number, type: number, param: number) {
        let fbo1 = this.createFBO(w, h, internalFormat, format, type, param);
        let fbo2 = this.createFBO(w, h, internalFormat, format, type, param);

        return {
            get read () {
                return fbo1;
            },
            set read (value) {
                fbo1 = value;
            },
            get write () {
                return fbo2;
            },
            set write (value) {
                fbo2 = value;
            },
            swap () {
                let temp = fbo1;
                fbo1 = fbo2;
                fbo2 = temp;
            }
        };
    }

    private resizeFBO (target, w: number, h: number, internalFormat: number, format: number, type: number, param: number) {
        let newFBO = this.createFBO(w, h, internalFormat, format, type, param);
        this.clearProgram.bind(this.gl);
        this.gl.uniform1i(this.clearProgram.uniforms.uTexture, target.attach(0));
        this.gl.uniform1f(this.clearProgram.uniforms.value, 1);
        this.blit(newFBO.fbo);
        return newFBO;
    }

    private resizeDoubleFBO (target, w: number, h: number, internalFormat: number, format: number, type: number, param: number) {
        target.read = this.resizeFBO(target.read, w, h, internalFormat, format, type, param);
        target.write = this.createFBO(w, h, internalFormat, format, type, param);
        return target;
    }

    private step (dt) {
        this.gl.disable(this.gl.BLEND);
        this.gl.viewport(0, 0, this.simWidth, this.simHeight);

        this.curlProgram.bind(this.gl);
        this.gl.uniform2f(this.curlProgram.uniforms.texelSize, 1.0 / this.simWidth, 1.0 / this.simHeight);
        this.gl.uniform1i(this.curlProgram.uniforms.uVelocity, this.velocity.read.attach(0));
        this.blit(this.curl.fbo);

        this.vorticityProgram.bind(this.gl);
        this.gl.uniform2f(this.vorticityProgram.uniforms.texelSize, 1.0 / this.simWidth, 1.0 / this.simHeight);
        this.gl.uniform1i(this.vorticityProgram.uniforms.uVelocity, this.velocity.read.attach(0));
        this.gl.uniform1i(this.vorticityProgram.uniforms.uCurl, this.curl.attach(1));
        this.gl.uniform1f(this.vorticityProgram.uniforms.curl, this.config.CURL);
        this.gl.uniform1f(this.vorticityProgram.uniforms.dt, dt);
        this.blit(this.velocity.write.fbo);
        this.velocity.swap();

        this.divergenceProgram.bind(this.gl);
        this.gl.uniform2f(this.divergenceProgram.uniforms.texelSize, 1.0 / this.simWidth, 1.0 / this.simHeight);
        this.gl.uniform1i(this.divergenceProgram.uniforms.uVelocity, this.velocity.read.attach(0));
        this.blit(this.divergence.fbo);

        this.clearProgram.bind(this.gl);
        this.gl.uniform1i(this.clearProgram.uniforms.uTexture, this.pressure.read.attach(0));
        this.gl.uniform1f(this.clearProgram.uniforms.value, this.config.PRESSURE_DISSIPATION);
        this.blit(this.pressure.write.fbo);
        this.pressure.swap();

        this.pressureProgram.bind(this.gl);
        this.gl.uniform2f(this.pressureProgram.uniforms.texelSize, 1.0 / this.simWidth, 1.0 / this.simHeight);
        this.gl.uniform1i(this.pressureProgram.uniforms.uDivergence, this.divergence.attach(0));
        for (let i = 0; i < this.config.PRESSURE_ITERATIONS; i++) {
            this.gl.uniform1i(this.pressureProgram.uniforms.uPressure, this.pressure.read.attach(1));
            this.blit(this.pressure.write.fbo);
            this.pressure.swap();
        }

        this.gradientSubtractProgram.bind(this.gl);
        this.gl.uniform2f(this.gradientSubtractProgram.uniforms.texelSize, 1.0 / this.simWidth, 1.0 / this.simHeight);
        this.gl.uniform1i(this.gradientSubtractProgram.uniforms.uPressure, this.pressure.read.attach(0));
        this.gl.uniform1i(this.gradientSubtractProgram.uniforms.uVelocity, this.velocity.read.attach(1));
        this.blit(this.velocity.write.fbo);
        this.velocity.swap();

        this.advectionProgram.bind(this.gl);
        this.gl.uniform2f(this.advectionProgram.uniforms.texelSize, 1.0 / this.simWidth, 1.0 / this.simHeight);
        if (!this.ext.supportLinearFiltering)
            this.gl.uniform2f(this.advectionProgram.uniforms.dyeTexelSize, 1.0 / this.simWidth, 1.0 / this.simHeight);
        let velocityId = this.velocity.read.attach(0);
        this.gl.uniform1i(this.advectionProgram.uniforms.uVelocity, velocityId);
        this.gl.uniform1i(this.advectionProgram.uniforms.uSource, velocityId);
        this.gl.uniform1f(this.advectionProgram.uniforms.dt, dt);
        this.gl.uniform1f(this.advectionProgram.uniforms.dissipation, this.config.VELOCITY_DISSIPATION);
        this.blit(this.velocity.write.fbo);
        this.velocity.swap();

        this.gl.viewport(0, 0, this.dyeWidth, this.dyeHeight);

        if (!this.ext.supportLinearFiltering)
            this.gl.uniform2f(this.advectionProgram.uniforms.dyeTexelSize, 1.0 / this.dyeWidth, 1.0 / this.dyeHeight);
        this.gl.uniform1i(this.advectionProgram.uniforms.uVelocity, this.velocity.read.attach(0));
        this.gl.uniform1i(this.advectionProgram.uniforms.uSource, this.density.read.attach(1));
        this.gl.uniform1f(this.advectionProgram.uniforms.dissipation, this.config.DENSITY_DISSIPATION);
        this.blit(this.density.write.fbo);
        this.density.swap();
    }

    private render (target) {
        if (this.config.BLOOM)
            this.applyBloom(this.density.read, this.bloom);

        if (target == null || !this.config.TRANSPARENT) {
            this.gl.blendFunc(this.gl.ONE, this.gl.ONE_MINUS_SRC_ALPHA);
            this.gl.enable(this.gl.BLEND);
        }
        else {
            this.gl.disable(this.gl.BLEND);
        }

        let width  = target == null ? this.gl.drawingBufferWidth : this.dyeWidth;
        let height = target == null ? this.gl.drawingBufferHeight : this.dyeHeight;

        this.gl.viewport(0, 0, width, height);

        if (!this.config.TRANSPARENT) {
            this.colorProgram.bind(this.gl);
            let bc = this.config.BACK_COLOR;
            this.gl.uniform4f(this.colorProgram.uniforms.color, bc.r / 255, bc.g / 255, bc.b / 255, 1);
            this.blit(target);
        }

        if (target == null && this.config.TRANSPARENT) {
            this.backgroundProgram.bind(this.gl);
            this.gl.uniform1f(this.backgroundProgram.uniforms.aspectRatio, this.canvas.width / this.canvas.height);
            this.blit(null);
        }

        if (this.config.SHADING) {
            let program = this.config.BLOOM ? this.displayBloomShadingProgram : this.displayShadingProgram;
            program.bind(this.gl);
            this.gl.uniform2f(program.uniforms.texelSize, 1.0 / width, 1.0 / height);
            this.gl.uniform1i(program.uniforms.uTexture, this.density.read.attach(0));
            if (this.config.BLOOM) {
                this.gl.uniform1i(program.uniforms.uBloom, this.bloom.attach(1));
                this.gl.uniform1i(program.uniforms.uDithering, this.ditheringTexture.attach(2));
                let scale = FluidRender.getTextureScale(this.ditheringTexture, width, height);
                this.gl.uniform2f(program.uniforms.ditherScale, scale.x, scale.y);
            }
        }
        else {
            let program = this.config.BLOOM ? this.displayBloomProgram : this.displayProgram;
            program.bind(this.gl);
            this.gl.uniform1i(program.uniforms.uTexture, this.density.read.attach(0));
            if (this.config.BLOOM) {
                this.gl.uniform1i(program.uniforms.uBloom, this.bloom.attach(1));
                this.gl.uniform1i(program.uniforms.uDithering, this.ditheringTexture.attach(2));
                let scale = FluidRender.getTextureScale(this.ditheringTexture, width, height);
                this.gl.uniform2f(program.uniforms.ditherScale, scale.x, scale.y);
            }
        }

        this.blit(target);
    }

    private applyBloom (source, destination) {
        if (this.bloomFramebuffers.length < 2)
            return;

        let last = destination;

        this.gl.disable(this.gl.BLEND);
        this.bloomPrefilterProgram.bind(this.gl);
        let knee = this.config.BLOOM_THRESHOLD * this.config.BLOOM_SOFT_KNEE + 0.0001;
        let curve0 = this.config.BLOOM_THRESHOLD - knee;
        let curve1 = knee * 2;
        let curve2 = 0.25 / knee;
        this.gl.uniform3f(this.bloomPrefilterProgram.uniforms.curve, curve0, curve1, curve2);
        this.gl.uniform1f(this.bloomPrefilterProgram.uniforms.threshold, this.config.BLOOM_THRESHOLD);
        this.gl.uniform1i(this.bloomPrefilterProgram.uniforms.uTexture, source.attach(0));
        this.gl.viewport(0, 0, last.width, last.height);
        this.blit(last.fbo);

        this.bloomBlurProgram.bind(this.gl);
        for (let i = 0; i < this.bloomFramebuffers.length; i++) {
            let dest = this.bloomFramebuffers[i];
            this.gl.uniform2f(this.bloomBlurProgram.uniforms.texelSize, 1.0 / last.width, 1.0 / last.height);
            this.gl.uniform1i(this.bloomBlurProgram.uniforms.uTexture, last.attach(0));
            this.gl.viewport(0, 0, dest.width, dest.height);
            this.blit(dest.fbo);
            last = dest;
        }

        this.gl.blendFunc(this.gl.ONE, this.gl.ONE);
        this.gl.enable(this.gl.BLEND);

        for (let i = this.bloomFramebuffers.length - 2; i >= 0; i--) {
            let baseTex = this.bloomFramebuffers[i];
            this.gl.uniform2f(this.bloomBlurProgram.uniforms.texelSize, 1.0 / last.width, 1.0 / last.height);
            this.gl.uniform1i(this.bloomBlurProgram.uniforms.uTexture, last.attach(0));
            this.gl.viewport(0, 0, baseTex.width, baseTex.height);
            this.blit(baseTex.fbo);
            last = baseTex;
        }

        this.gl.disable(this.gl.BLEND);
        this.bloomFinalProgram.bind(this.gl);
        this.gl.uniform2f(this.bloomFinalProgram.uniforms.texelSize, 1.0 / last.width, 1.0 / last.height);
        this.gl.uniform1i(this.bloomFinalProgram.uniforms.uTexture, last.attach(0));
        this.gl.uniform1f(this.bloomFinalProgram.uniforms.intensity, this.config.BLOOM_INTENSITY);
        this.gl.viewport(0, 0, destination.width, destination.height);
        this.blit(destination.fbo);
    }

    private checkResizeCanvas () {
        if (this.canvas.width !== this.canvas.clientWidth || this.canvas.height !== this.canvas.clientHeight) {
            this.canvas.width = this.canvas.clientWidth;
            this.canvas.height = this.canvas.clientHeight;
            this.initFrameBuffers();
        }
    }

    static generateColor () {
        let c = HSVtoRGB(Math.random(), 1.0, 1.0);
        c.r *= 0.15;
        c.g *= 0.15;
        c.b *= 0.15;
        return c;
    }

    private static getTextureScale (texture, width, height) {
        return {
            x: width / texture.width,
            y: height / texture.height
        };
    }

    private static getWebGLContext (canvas: HTMLCanvasElement): { gl: WebGL2RenderingContext, ext: IGLExtentsions } {
        const params = { alpha: true, depth: false, stencil: false, antialias: false, preserveDrawingBuffer: false };

        let gl: WebGL2RenderingContext = canvas.getContext("webgl2", params) as WebGL2RenderingContext;
        const isWebGL2 = !!gl;
        if (!isWebGL2)
            gl = (canvas.getContext("webgl", params) || canvas.getContext("experimental-webgl", params)) as WebGL2RenderingContext;

        let halfFloat;
        let supportLinearFiltering;
        if (isWebGL2) {
            gl.getExtension("EXT_color_buffer_float");
            supportLinearFiltering = gl.getExtension("OES_texture_float_linear");
        } else {
            halfFloat = gl.getExtension("OES_texture_half_float");
            supportLinearFiltering = gl.getExtension("OES_texture_half_float_linear");
        }

        gl.clearColor(0.0, 0.0, 0.0, 1.0);

        const halfFloatTexType = isWebGL2 ? gl.HALF_FLOAT : halfFloat.HALF_FLOAT_OES;
        let formatRGBA;
        let formatRG;
        let formatR;

        if (isWebGL2) {
            formatRGBA = FluidRender.getSupportedFormat(gl, gl.RGBA16F, gl.RGBA, halfFloatTexType);
            formatRG = FluidRender.getSupportedFormat(gl, gl.RG16F, gl.RG, halfFloatTexType);
            formatR = FluidRender.getSupportedFormat(gl, gl.R16F, gl.RED, halfFloatTexType);
        }
        else {
            formatRGBA = FluidRender.getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
            formatRG = FluidRender.getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
            formatR = FluidRender.getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
        }

        if (formatRGBA == null)
            // ga('send', 'event', isWebGL2 ? 'webgl2' : 'webgl', 'not supported');
            console.log(`${isWebGL2 ? "WsbGL2" : "WebGL"} not supported`);
        else
            // ga('send', 'event', isWebGL2 ? 'webgl2' : 'webgl', 'supported');
            console.log(`${isWebGL2 ? "WsbGL2" : "WebGL"} supported`);

        return {
            gl,
            ext: {
                formatRGBA,
                formatRG,
                formatR,
                halfFloatTexType,
                supportLinearFiltering
            }
        };
    }

    private static getSupportedFormat (gl, internalFormat, format, type) {
        if (!FluidRender.supportRenderTextureFormat(gl, internalFormat, format, type)) {
            switch (internalFormat) {
                case gl.R16F:
                    return FluidRender.getSupportedFormat(gl, gl.RG16F, gl.RG, type);
                case gl.RG16F:
                    return FluidRender.getSupportedFormat(gl, gl.RGBA16F, gl.RGBA, type);
                default:
                    return null;
            }
        }

        return {
            internalFormat,
            format
        };
    }

    private static supportRenderTextureFormat (gl: WebGL2RenderingContext, internalFormat, format, type): boolean {
        let texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, 4, 4, 0, format, type, null);

        let fbo = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);

        const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
        if (status !== gl.FRAMEBUFFER_COMPLETE)
            return false;
        return true;
    }

    splat (x: number, y: number, dx: number, dy :number, color: { r: number, g: number, b: number }, radius?: number) {
        this.gl.viewport(0, 0, this.simWidth, this.simHeight);
        this.splatProgram.bind(this.gl);
        this.gl.uniform1i(this.splatProgram.uniforms.uTarget, this.velocity.read.attach(0));
        this.gl.uniform1f(this.splatProgram.uniforms.aspectRatio, this.canvas.width / this.canvas.height);
        this.gl.uniform2f(this.splatProgram.uniforms.point, x / this.canvas.width, 1.0 - y / this.canvas.height);
        this.gl.uniform3f(this.splatProgram.uniforms.color, dx, -dy, 1.0);
        this.gl.uniform1f(this.splatProgram.uniforms.radius, (radius || this.config.SPLAT_RADIUS) / 100.0);
        this.blit(this.velocity.write.fbo);
        this.velocity.swap();

        this.gl.viewport(0, 0, this.dyeWidth, this.dyeHeight);
        this.gl.uniform1i(this.splatProgram.uniforms.uTarget, this.density.read.attach(0));
        this.gl.uniform3f(this.splatProgram.uniforms.color, color.r, color.g, color.b);
        this.blit(this.density.write.fbo);
        this.density.swap();
    }

    randomSplats (amount: number) {
        for (let i = 0; i < amount; i++) {
            const color = FluidRender.generateColor();
            color.r *= 10.0;
            color.g *= 10.0;
            color.b *= 10.0;
            const x = this.canvas.width * Math.random();
            const y = this.canvas.height * Math.random();
            const dx = 1000 * (Math.random() - 0.5);
            const dy = 1000 * (Math.random() - 0.5);
            this.splat(x, y, dx, dy, color);
        }
    }

    update(dt: number) {
        if (this.ditheringTexture.width === 1) console.log("Attempted to render when image is not loaded!");
        else {
            this.checkResizeCanvas();
            this.step(dt);
            this.render(null);
        }
    }
}

export default FluidRender;