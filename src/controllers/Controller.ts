
import Configuration from '../model/Configuration';

export default abstract class Controller {
    protected readonly appConfig: Configuration;

    constructor(config: Configuration) {
        this.appConfig = config;
    }
}