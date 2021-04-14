import ImageConfiguration from './ImageConfiguration';
/**
 * @todo refactor to Singleton pattern https://refactoring.guru/design-patterns/singleton/typescript/example
 */
export default class Configuration {
    public readonly outputDims: {
        largeVersion: { width: number, height: number }; 
        smallVersion: { width: number, height: number };
    };
    public readonly registeredImages: ImageConfiguration[];

    constructor(configJson: any) {
        const large = configJson['output-dims']['large-version'];
        const small = configJson['output-dims']['small-version'];

        this.outputDims = {
            largeVersion: { width: parseInt(large['width']), height: parseInt(large['height']) },
            smallVersion: { width: parseInt(small['width']), height: parseInt(small['height']) }
        };
        
        this.registeredImages = [];
        configJson['registered-images'].forEach((imgData: any) => {
            this.registeredImages.push(new ImageConfiguration({
                filename: imgData.filename as string,
                cutoutArea: {
                    xFrom: parseInt(imgData['cutout-area']['x-from']),
                    yFrom: parseInt(imgData['cutout-area']['y-from']),
                    xTo: parseInt(imgData['cutout-area']['x-to']),
                    yTo: parseInt(imgData['cutout-area']['y-to'])
                }
            }));
        });
    }
};
