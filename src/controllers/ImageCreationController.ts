// Libraries
import {
    loadImage,
    Image,
    createCanvas,
    Canvas
} from 'canvas';
import fs from 'fs';
// Other classes
import Controller from './Controller';
import Configuration from '../model/Configuration';
import RequestParameters from '../view/RequestParameters';
import ImageConfiguration from '../model/ImageConfiguration';
import IpaLookup from '../model/IpaLookup';
import PossibleLanguages from '../model/PossibleLanguages';


export default class ImageCreationController extends Controller {
    // Parameters for positioning of element within the image.
    private seperatorY: number = 1800;
    private seperatorThickness: number = 5;

    private distToFrame: number = 80;

    private headerSizePx: number = 350;
    private textSizePx: number = 60;
    private lineSepSpace: number = 10;

    private headerFontName: string = 'Josefin Sans';
    private textFontName: string = 'Noto Serif';
    
    private color: 'black' | 'white' = 'white';

    private shadowOffsetX: number = 5;
    private shadowOffsetY: number = 3;
    private shadowBlur: number = 2;
    private shadowColor: string = 'rgba(0, 0, 0, 0.5)';

    constructor(config: Configuration) {
        super(config);
    }

    public async executeRequest(
        outputFilename: string, 
        reqParams: RequestParameters,
        finishCallback: () => void
    ): Promise<void> {

        // Bild ausschneiden
        console.log('BACKGROUND', reqParams.preMadeBackground);
        const background: Promise<Canvas> = this.generateBackgroundLayer(reqParams.preMadeBackground);
        console.log('Background', background);
        // Rahmen generieren
        const frame: Promise<Canvas> = this.generateFrameLayer(reqParams.style.frameWidth);

        const phon: Promise<Canvas> = this.generatePhoneticsLayer({
            word: reqParams.term,
            lang: reqParams.lang,
            frameWidth: reqParams.style.frameWidth
        });

        const header: Promise<Canvas> = this.generateHeaderLayer({
            term: reqParams.term,
            frameWidth: reqParams.style.frameWidth
        });

        const seperator: Promise<Canvas> = this.generateSeperatorLayer({
            filename: reqParams.preMadeBackground,
            frameWidth: reqParams.style.frameWidth
        });

        const mainText: Promise<Canvas> = this.generateExplainText({
            text: reqParams.text,
            frameWidth: reqParams.style.frameWidth
        });

        const allOps = await Promise.all([
            background, 
            frame,
            header,
            phon,
            seperator,
            mainText
        ]);
        console.log('all Proms', allOps);

        const backgroundCnv: Canvas = allOps[0];
        const frameCnv: Canvas = allOps[1];
        const headerCnv: Canvas = allOps[2];
        const phonCnv: Canvas = allOps[3];
        const sepCnv: Canvas = allOps[4];
        const mainTextCnv: Canvas = allOps[5];

        const background2dContext = backgroundCnv.getContext('2d');
        background2dContext.drawImage(frameCnv, 0, 0);
        background2dContext.drawImage(headerCnv, 0, 0);
        background2dContext.drawImage(phonCnv, 0, 0);
        background2dContext.drawImage(sepCnv, 0, 0);
        background2dContext.drawImage(mainTextCnv, 0, 0);

        console.log('Before finish line');
        const name = `${__dirname}/../../temp/${outputFilename}`;
        const out = fs.createWriteStream(name, { flags: 'w' });

        out.on('finish', finishCallback);
        out.on('error', err => {
            throw new Error(err.message);
        });

        const stream = backgroundCnv.createPNGStream();
        stream.pipe(out);
    }

    /**
     * 
     * @param filename 
     * @throws {TypeError} If there is no configuration for this image.
     */
    private async generateBackgroundLayer(filename: string): Promise<Canvas> {
        return new Promise<Canvas>(async (resolve, reject) => {
            try {
                const cutout = this.getCutoutArea(filename);
                const { width, height } = this.getTargetArea();
                const targetWidth = width;
                const targetHeight = height;

                const canvas: Canvas = createCanvas(targetWidth, targetHeight);
                const context2d = canvas.getContext('2d');
                const img: Image = await loadImage(`./img/${filename}`);
                context2d.drawImage(
                    img, 
                    cutout.cutoutArea.xFrom, cutout.cutoutArea.yFrom, // source x and y
                    // targetWidth, targetHeight, // width, height within source 
                    cutout.cutoutArea.xTo, cutout.cutoutArea.yTo,
                    0, 0, // destination upper left corner 
                    targetWidth, targetHeight   
                    // 1000, 1000         
                );
                console.log('Resolved canvas', canvas);
                resolve(canvas);
            } catch (err) {
                reject(err);
            }
        });
    }


    private async generateFrameLayer(frameWidth: number): Promise<Canvas> {
        return new Promise((resolve, reject) => {
            try {
                const { width, height } = this.getTargetArea();

                const canvas: Canvas = createCanvas(width, height);
                const context2d = canvas.getContext('2d');
        
                context2d.strokeStyle = this.color;
                context2d.lineWidth = frameWidth * 2; // *2 because other half of stroke is outside.

                context2d.shadowOffsetX = this.shadowOffsetX;
                context2d.shadowOffsetY = this.shadowOffsetY;
                context2d.shadowBlur = this.shadowBlur;
                context2d.shadowColor = this.shadowColor;
        
                context2d.beginPath();
                context2d.moveTo(0, 0);
                context2d.lineTo(width, 0);
                context2d.lineTo(width, height);
                context2d.lineTo(0, height);
                context2d.lineTo(0, 0);
                context2d.stroke();
                
                resolve(canvas);
            } catch (err) {
                reject(err);
            }
        });
    }

    private async generatePhoneticsLayer({ word, lang, frameWidth }: {
        word: string, 
        lang: PossibleLanguages,
        frameWidth?: number
    }): Promise<Canvas> {
        return new Promise<Canvas>(async (resolve, reject) => {
            try {
                const { width, height } = this.getTargetArea();


                const canvas: Canvas = createCanvas(width, height);
                const context2d = canvas.getContext('2d');

                const lookup = new IpaLookup(lang);

                context2d.font = `${this.textSizePx}px "${this.textFontName}"`;
                context2d.fillStyle = this.color;
                const phoneticsStartX = (frameWidth || 0) + this.distToFrame;
                const phoneticsStartY = this.seperatorY + this.distToFrame + this.textSizePx;

                let phonetics = await lookup.getPhonetics(word);
                phonetics = lang === PossibleLanguages.GERMAN ? `[${phonetics}]` : `/${phonetics}/`;
            
                context2d.shadowOffsetX = this.shadowOffsetX;
                context2d.shadowOffsetY = this.shadowOffsetY;
                context2d.shadowBlur = this.shadowBlur;
                context2d.shadowColor = this.shadowColor;


                context2d.fillText(phonetics, phoneticsStartX, phoneticsStartY);                
                resolve(canvas);
            } catch (err) {
                reject(err);
            }
        });
    }

    private async generateHeaderLayer({ term, frameWidth }: {
        term: string,
        frameWidth: number
    }): Promise<Canvas> {
        return new Promise<Canvas>((resolve, reject) => {
            try {            
                const { width, height } = this.getTargetArea();


                const canvas: Canvas = createCanvas(width, height);
                const context2d = canvas.getContext('2d');

                context2d.fillStyle = this.color;
                // + 20 such that it is not completely on the edge.
                const usableWidth = width - (2 * this.distToFrame + 2 * frameWidth + 20);
                context2d.font = `${this.headerSizePx}px "${this.headerFontName}"`;
                while (context2d.measureText(term).width > usableWidth) {
                    this.headerSizePx--;
                    context2d.font = `${this.headerSizePx}px "${this.headerFontName}"`;
                }
                
                const headerStartY = this.seperatorY - this.distToFrame /* - this.headerSizePx */;
                const headerStartX = (frameWidth || 0) + this.distToFrame;

                context2d.shadowOffsetX = this.shadowOffsetX;
                context2d.shadowOffsetY = this.shadowOffsetY;
                context2d.shadowBlur = this.shadowBlur;
                context2d.shadowColor = this.shadowColor;

                context2d.fillStyle = this.color;
                context2d.fillText(term, headerStartX, headerStartY);

                resolve(canvas);
            } catch (err) {
                reject(err);
            }
        });
    }


    private async generateSeperatorLayer({ filename, frameWidth }: {
        filename: string,
        frameWidth: number
    }): Promise<Canvas> {
        return new Promise<Canvas>((resolve, reject) => {
            try {
                const { width, height } = this.getTargetArea();

                const canvas: Canvas = createCanvas(width, height);
                const context2d = canvas.getContext('2d');

                context2d.strokeStyle = this.color;
                context2d.lineWidth = this.seperatorThickness;
                context2d.shadowOffsetX = this.shadowOffsetX;
                context2d.shadowOffsetY = this.shadowOffsetY;
                context2d.shadowBlur = this.shadowBlur;
                context2d.shadowColor = this.shadowColor;

                context2d.beginPath();
                context2d.moveTo(this.distToFrame + frameWidth, this.seperatorY);
                context2d.lineTo(width - this.distToFrame - frameWidth, this.seperatorY);
                context2d.stroke();

                resolve(canvas);
            } catch (err) {
                reject(err);
            }
        });
    }

    private async generateExplainText({ text, frameWidth }: {
        text: string,
        frameWidth: number
    }): Promise<Canvas> {
        return new Promise<Canvas>((resolve, reject) => {
            try {
                const { width, height } = this.getTargetArea();
        
                const canvas: Canvas = createCanvas(width, height);
                const context2d = canvas.getContext('2d');

                context2d.font = `${this.textSizePx}px "${this.textFontName}"`;
                context2d.fillStyle = this.color;

                context2d.shadowOffsetX = this.shadowOffsetX;
                context2d.shadowOffsetY = this.shadowOffsetY;
                context2d.shadowBlur = this.shadowBlur;
                context2d.shadowColor = this.shadowColor;
                
                const textStartX = (frameWidth || 0) + this.distToFrame;
                const textUsableWidth = width - 2 * (frameWidth + this.distToFrame);
                let currentTextY = this.seperatorY + 2 * (this.textSizePx + this.distToFrame);

                const unusedWords = text.split(' ');
                let usedWords: string[] = [];

                for (const word of unusedWords) {
                    const textWidth = context2d.measureText([...usedWords, word].join(' ')).width;
                    if (textWidth > textUsableWidth) {
                        const writeText = usedWords.join(' ');
                        context2d.strokeText(writeText, textStartX, currentTextY);
                        context2d.fillText(writeText, textStartX, currentTextY);
                        currentTextY += this.textSizePx + this.lineSepSpace;
                        usedWords = [];
                    }

                    usedWords.push(word);
                }

                resolve(canvas);
            } catch (err) {
                reject(err);
            }
        });
    }

    /**
     * 
     * @param filename 
     * @returns 
     * @throws {TypeError} If there is no configuration for this image.
     */
    private getTargetArea(): { width: number, height: number } {
        return this.appConfig.outputDims.largeVersion;
    }

    private getCutoutArea(filename: string): ImageConfiguration {
        for (const imageSpec of this.appConfig.registeredImages) {
            console.log('FILENAME', imageSpec.filename);
            if (imageSpec.filename === filename) {
                return imageSpec;
            }
        }
        throw new TypeError(`Image with filename ${filename} not found.`);

    }
}

