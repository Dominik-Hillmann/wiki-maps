// Libraries
import {
    loadImage,
    Image,
    createCanvas,
    Canvas,
    JPEGStream,
    PNGStream
} from 'canvas';
import fs from 'fs';
// Other classes
import Controller from './Controller';
import Configuration from '../model/Configuration';
import RequestParameters from '../view/RequestParameters';
import ImageConfiguration from '../model/ImageConfiguration';

function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

export default class ImageCreationController extends Controller {
    constructor(config: Configuration) {
        super(config);
    }

    public async executeRequest(
        outputFilename: string, 
        reqParams: RequestParameters,
        finishCallback: () => void
    ): Promise<void> {

        // Bild ausschneiden
        const background: Promise<Canvas> = this.cutPremadeImage(reqParams.preMadeBackground || 'coast-curve.jpg');
        // Rahmen generieren
        const frame: Promise<Canvas> = this.generateFrame(
            reqParams.preMadeBackground || 'coast-curve.jpg', 
            reqParams.style.frameWidth
        );

        const allOps = await Promise.all([
            background, 
            frame
        ]);

        const backgroundCnv: Canvas = allOps[0];
        const frameCnv: Canvas = allOps[1];

        // const background2dContext = backgroundCnv.getContext('2d');
        // background2dContext.drawImage(frameCnv, 0, 0);
        console.log('Before finish line');
        const name: string = `${__dirname}/../temp/test2.png`;
        const out: fs.WriteStream = fs.createWriteStream(name);
        const stream: PNGStream = backgroundCnv.createPNGStream();
        stream.pipe(out);
        console.log('Before finish line');
        out
            .on('finish', finishCallback);
        out.on('close', () => 1);
        // const name = `${__dirname}\\..\\temp\\${outputFilename}`;
        // const out: fs.WriteStream = fs.createWriteStream(name);
        // const stream: PNGStream = backgroundCnv.createPNGStream();
        // stream.pipe(out);
        // return new Promise<fs.WriteStream>((reject, resolve) => {
        //     try {
        //         resolve(out);
        //     } catch (err) {
        //         reject(err);
        //     }
        // });
        // out.on('finish', () => console.log('Created PNG.'));
        
        // Schrift generieren
        // Phonetik generieren (vorerst nicht)

        // Text generieren
    }

    /**
     * 
     * @param filename 
     * @throws {TypeError} If there is no configuration for this image.
     */
    private async cutPremadeImage(filename: string): Promise<Canvas> {
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
                    0, 0, // source x and y
                    width, height, // width, height within source 
                    0, 0, // destination upper left corner 
                    width, height            
                );

                resolve(canvas);
            } catch (err) {
                reject(err);
            }
        });
    }


    private async generateFrame(filename: string, frameWidth: number): Promise<Canvas> {
        return new Promise((resolve, reject) => {
            try {
                const cutout = this.getCutoutArea(filename);
                const width: number = cutout.getWidth();
                const height: number = cutout.getHeight();
        
                const canvas: Canvas = createCanvas(width, height);
                const context2d = canvas.getContext('2d');
        
                context2d.strokeStyle = '#FFFFFF';
                context2d.lineWidth = frameWidth;
        
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

    /**
     * 
     * @param filename 
     * @returns 
     * @throws {TypeError} If there is no configuration for this image.
     */
    private getCutoutArea(filename: string): ImageConfiguration {
        for (const imageSpec of this.imageSpecifications) {
            if (imageSpec.filename === filename) {
                return imageSpec;
            }
        }
        throw new TypeError(`Image with filename ${filename} not found.`);
    }
}

