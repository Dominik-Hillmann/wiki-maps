
import Configuration from '../model/Configuration';
import ImageConfiguration from '../model/ImageConfiguration';
import RequestParameters from '../view/RequestParameters';

export default abstract class Controller {
    protected readonly appConfig: Configuration;

    constructor(config: Configuration) {
        this.appConfig = config;
    }

    // public abstract executeRequest(outputFilename: string, reqParams: RequestParameters): void;
}