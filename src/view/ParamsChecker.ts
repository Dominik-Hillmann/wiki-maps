// Modules
import RequestParameters from './RequestParameters';
import PossibleLanguages from '../model/PossibleLanguages';
import Configuration from '../model/Configuration';

export default class ParamsChecker {
    private correct: boolean = true;
    private reason: string = '';

    constructor(req: any, config: Configuration) {
        // Check if it fits RequestParameters interface.
        // Style already checked by doing so.
        let test: RequestParameters;
        test = req.query;

        try {
            if (!('term' in req.query) && req.query.term === '' ) {
                throw new Error('Term is empty.');
            }

            if (!('text' in req.query) && req.query.text === '') {
                throw new Error('Text is empty.');
            }

            const hasLang = Object.values(PossibleLanguages)
                .some(langVal => langVal === req.query.lang);
            if (!('lang' in req.query) && !hasLang) {
                throw new Error('Specified language not available.');
            }
            
            console.log(config.registeredImages
                .map(imgConfig => imgConfig.filename), [req.query.preMadeBackground])
            const hasBackground = config.registeredImages
                .map(imgConfig => imgConfig.filename)
                .some(filename => filename === req.query.preMadeBackground);
            if (!('preMadeBackground' in req.query) && !hasBackground) {
                throw new Error('Specified background not provided.');
            }

            if (!('styleColor' in req.query)) {
                throw new Error('no style color given');
            }

            
            if (!('styleFrameWidth' in req.query)) {
                throw new Error('no style frame width given');
            }
        } catch (err) {
            this.correct = false;
            this.reason = `Parameters missing (${err.message})`;
        }
    }

    areCorrect(): boolean {
        return this.correct;
    }

    getReason(): string {
        return this.reason;
    }
}