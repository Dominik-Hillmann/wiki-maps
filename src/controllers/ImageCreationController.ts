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
import IpaLookup from '../model/ipa-lookup/IpaLookup';
import PossibleLanguages from '../model/PossibleLanguages';


export default class ImageCreationController extends Controller {
    // Parameters for positioning of element within the image.
    private seperatorY: number = 2500;
    private seperatorThickness: number = 5;

    private distToFrame: number = 100;

    private headerSizePx: number = 400;
    private textSizePx: number = 100;
    private lineSepSpace: number = 5;

    private headerFontName: string = 'Josefin Sans';
    private textFontName: string = 'Noto Serif';
    
    constructor(config: Configuration) {
        super(config);
    }

    public async executeRequest(
        outputFilename: string, 
        reqParams: RequestParameters,
        finishCallback: () => void
    ): Promise<void> {
        // Before we do any expensive image computation, look up if this word even
        // exists in IPA





        // Bild ausschneiden
        const background: Promise<Canvas> = this.generateBackgroundLayer(reqParams.preMadeBackground || 'coast-curve.jpg');
        console.log('Background', background);
        // Rahmen generieren
        const frame: Promise<Canvas> = this.generateFrameLayer(
            reqParams.preMadeBackground || 'coast-curve.jpg', 
            reqParams.style.frameWidth
        );
        console.log('Frame', frame);

        const phon: Promise<Canvas> = this.generatePhoneticsLayer({
            filename: reqParams.preMadeBackground || 'coast-curve.jpg',
            word: reqParams.term,
            lang: reqParams.lang,
            writingBorder: reqParams.style.writingBorder,
            frameWidth: reqParams.style.frameWidth
        });

        const header: Promise<Canvas> = this.generateHeaderLayer({
            term: reqParams.term,
            filename: reqParams.preMadeBackground || 'coast-curve.jpg',
            writingBorder: reqParams.style.writingBorder,
            frameWidth: reqParams.style.frameWidth
        });

        const seperator: Promise<Canvas> = this.generateSeperatorLayer({
            filename: reqParams.preMadeBackground || 'coast-curve.jpg',
            frameWidth: reqParams.style.frameWidth
        });

        const mainText: Promise<Canvas> = this.generateExplainText({
            text: reqParams.text,
            filename: reqParams.preMadeBackground || 'coast-curve.jpg',
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
        const cutout: ImageConfiguration = this.getCutoutArea(filename);
        const width: number = cutout.getWidth();
        const height: number = cutout.getHeight();

        const canvas: Canvas = createCanvas(cutout.getWidth(), cutout.getHeight());
        const context2d = canvas.getContext('2d');
        const img: Image = await loadImage(`./img/${filename}`);

        return new Promise<Canvas>((resolve, reject) => {
            try {                
                context2d.drawImage(
                    img, 
                    cutout.cutoutArea.xFrom, cutout.cutoutArea.yFrom, // source x and y
                    width, height, // width, height within source 
                    0, 0, // destination upper left corner 
                    width, height            
                );
                console.log('Resolved canvas', canvas);
                resolve(canvas);
            } catch (err) {
                reject(err);
            }
        });
    }


    private async generateFrameLayer(filename: string, frameWidth: number): Promise<Canvas> {
        return new Promise((resolve, reject) => {
            try {
                const cutout = this.getCutoutArea(filename);
                const width: number = cutout.getWidth();
                const height: number = cutout.getHeight();
        
                const canvas: Canvas = createCanvas(width, height);
                const context2d = canvas.getContext('2d');
        
                context2d.strokeStyle = '#FFFFFF';
                context2d.lineWidth = frameWidth * 2; // *2 because other half of stroke is outside.

                context2d.shadowOffsetX = 5;
                context2d.shadowOffsetY = 3;
                context2d.shadowBlur = 2;
                context2d.shadowColor = 'rgba(0, 0, 0, 0.5)';
        
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

    private async generatePhoneticsLayer({ filename, word, lang, writingBorder, frameWidth }: {
        filename: string, 
        word: string, 
        lang: PossibleLanguages,
        writingBorder?: 'stroked' | 'shadowed',
        frameWidth?: number
    }): Promise<Canvas> {
        return new Promise<Canvas>(async (resolve, reject) => {
            try {
                const cutout = this.getCutoutArea(filename);
                const width = cutout.getWidth();
                const height = cutout.getHeight();
        
                const canvas: Canvas = createCanvas(width, height);
                const context2d = canvas.getContext('2d');

                const lookup = new IpaLookup(lang);

                context2d.font = `${this.textSizePx}px "${this.textFontName}"`;
                context2d.fillStyle = 'white';
                const phoneticsStartX = (frameWidth || 0) + this.distToFrame;
                const phoneticsStartY = this.seperatorY + this.distToFrame + this.textSizePx;

                let phonetics: string = '';
                try {
                    phonetics = await lookup.getPhonetics(word);
                    phonetics = lang === PossibleLanguages.GERMAN ? `[${phonetics}]` : `/${phonetics}/`;
                } catch (err) {
                    phonetics = `Request for "${word}" failed.`;
                } finally {
                    if (writingBorder === 'stroked') {
                        context2d.strokeStyle = 'black';
                        context2d.lineWidth = 5;
                        context2d.strokeText(phonetics, phoneticsStartX, phoneticsStartY);
                    } else { 
                        // if shadowed or undefined
                        context2d.shadowOffsetX = 5;
                        context2d.shadowOffsetY = 3;
                        context2d.shadowBlur = 2;
                        context2d.shadowColor = 'rgba(0, 0, 0, 0.5)';
                    }

                    context2d.fillStyle = 'white';
                    context2d.fillText(phonetics, phoneticsStartX, phoneticsStartY);
                }
                
                resolve(canvas);
            } catch (err) {
                reject(err);
            }
        });
    }

    private async generateHeaderLayer({ term, filename, frameWidth, writingBorder }: {
        term: string,
        filename: string,
        frameWidth: number,
        writingBorder: 'stroked' | 'shadowed'
    }): Promise<Canvas> {
        return new Promise<Canvas>((resolve, reject) => {
            try {
                const cutout = this.getCutoutArea(filename);
                const width = cutout.getWidth();
                const height = cutout.getHeight();
        
                const canvas: Canvas = createCanvas(width, height);
                const context2d = canvas.getContext('2d');
                context2d.font = `${this.headerSizePx}px "${this.headerFontName}"`;
                context2d.fillStyle = 'white';
                
                const headerStartY = this.seperatorY - this.distToFrame /* - this.headerSizePx */;
                const headerStartX = (frameWidth || 0) + this.distToFrame;

                if (writingBorder === 'stroked') {
                    context2d.strokeStyle = 'black';
                    context2d.lineWidth = 5;
                    context2d.strokeText(term, headerStartX, headerStartY);
                } else { 
                    // if shadowed or undefined
                    context2d.shadowOffsetX = 5;
                    context2d.shadowOffsetY = 3;
                    context2d.shadowBlur = 2;
                    context2d.shadowColor = 'rgba(0, 0, 0, 0.5)';
                }

                context2d.fillStyle = 'white';
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
                const cutout = this.getCutoutArea(filename);
                const width = cutout.getWidth();
                const height = cutout.getHeight();
        
                const canvas: Canvas = createCanvas(width, height);
                const context2d = canvas.getContext('2d');

                context2d.strokeStyle = '#FFFFFF';
                context2d.lineWidth = this.seperatorThickness;
                context2d.shadowOffsetX = 5;
                context2d.shadowOffsetY = 3;
                context2d.shadowBlur = 2;
                context2d.shadowColor = 'rgba(0, 0, 0, 0.5)';

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

    private async generateExplainText({ text, filename, frameWidth, writingBorder }: {
        text: string,
        filename: string,
        frameWidth: number,
        writingBorder?: 'stroked' | 'shadowed'
    }): Promise<Canvas> {
        return new Promise<Canvas>((resolve, reject) => {
            try {
                const cutout = this.getCutoutArea(filename);
                const width = cutout.getWidth();
                const height = cutout.getHeight();
        
                const canvas: Canvas = createCanvas(width, height);
                const context2d = canvas.getContext('2d');

                context2d.font = `${this.textSizePx}px "${this.textFontName}"`;
                context2d.fillStyle = 'white';

                if (writingBorder === 'stroked') {
                    context2d.strokeStyle = 'black';
                    context2d.lineWidth = 5;
                } else { 
                    // if shadowed or undefined
                    context2d.shadowOffsetX = 5;
                    context2d.shadowOffsetY = 3;
                    context2d.shadowBlur = 2;
                    context2d.shadowColor = 'rgba(0, 0, 0, 0.5)';
                }
                
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
    private getCutoutArea(filename: string): ImageConfiguration {
        for (const imageSpec of this.appConfig.registeredImages) {
            if (imageSpec.filename === filename) {
                return imageSpec;
            }
        }
        throw new TypeError(`Image with filename ${filename} not found.`);
    }
}

