import ImageConfiguration from './ImageConfiguration';
import OutputDims from './OutputDims';

/**
 * @todo refactor to Singleton pattern https://refactoring.guru/design-patterns/singleton/typescript/example
 */
export default class Configuration {
    public readonly outputDims: OutputDims;
    public readonly registeredImages: ImageConfiguration[];

    constructor(configJson: any) {
        this.outputDims = {
            largeVersion: configJson['output-dims']['large-version'],
            smallVersion: configJson['output-dims']['small-version']
        };
        this.registeredImages = [];
        configJson['registered-images'].forEach((imgData: any) => {
            this.registeredImages.push(new ImageConfiguration(
                imgData.filename,
                imgData['cutout-area']
            ));
        });
    }
};
