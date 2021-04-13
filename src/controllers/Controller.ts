
import Configuration from '../model/Configuration';
import ImageConfiguration from '../model/ImageConfiguration';
import OutputDims from '../model/OutputDims';
import RequestParameters from '../view/RequestParameters';

export default abstract class Controller {
    protected readonly imageSpecifications: ImageConfiguration[];
    protected readonly possibOutputDims: OutputDims;

    constructor(config: Configuration) {
        this.imageSpecifications = config.registeredImages;
        this.possibOutputDims = config.outputDims;
    }

    // public abstract executeRequest(outputFilename: string, reqParams: RequestParameters): void;
}