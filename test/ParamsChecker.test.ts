// Libraries
import { describe, it } from 'mocha';
import chai from 'chai';
const expect = chai.expect;
import fs from 'fs';
// Modules
import ParamsChecker from '../src/view/ParamsChecker';
import PossibleLanguages from '../src/model/PossibleLanguages';
import Configuration from '../src/model/Configuration';

describe('Checks the ParamsLookup class.', () => {
    const configJson: any = JSON.parse(fs.readFileSync('./config.json').toString());
    const config: Configuration = new Configuration(configJson);

    const req: any = {
        query: {
            term: 'term',
            text: 'text',
            lang: PossibleLanguages.GERMAN,
            preMadeBackground: 'sand.jpg',
            styleColor: 'white',
            styleFrameWidth: 50
        }
    };

    it("Should say parameters are okay on okay parameters.", () => {
        const checker = new ParamsChecker(req, config);
        expect(checker.areCorrect()).to.be.true;
        expect(checker.getReason()).to.eql('');
    });

    it("Check if functionality for missing properties works.", () => {
        const noTermReq: any = {
            query: {
                // term: 'term',
                text: 'text',
                lang: PossibleLanguages.GERMAN,
                preMadeBackground: 'sand.jpg',
                styleColor: 'white',
                styleFrameWidth: 50
            }
        };
        const checker = new ParamsChecker(noTermReq, config);
        expect(checker.areCorrect()).to.be.false;
    });

    it("Check if functionality for empty properties works.", () => {
        const emptyTermReq: any = {
            query: {
                term: '',
                text: 'text',
                lang: PossibleLanguages.GERMAN,
                preMadeBackground: 'sand.jpg',
                styleColor: 'white',
                styleFrameWidth: 50
            }
        };
        const checker = new ParamsChecker(emptyTermReq, config);
        expect(checker.areCorrect()).to.be.false;
    });
});
