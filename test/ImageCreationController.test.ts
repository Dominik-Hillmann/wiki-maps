// Libraries
import { describe, it } from 'mocha';
import chai from 'chai';
const expect = chai.expect;
// Modules
import Configuration from '../src/model/Configuration';
import ImageCreationController from '../src/controllers/ImageCreationController';
import RequestParameters from '../src/view/RequestParameters';
import fs from 'fs';
import PossibleLanguages from '../src/model/PossibleLanguages';

describe('Check ImageCreationController class.', () => {
    const configJson: any = JSON.parse(fs.readFileSync('./config.json').toString());
    const config: Configuration = new Configuration(configJson);

    it('Should be able to be instatiated.', () => {
        new ImageCreationController(config);
    });

    it('Should throw an error on incorrect parameters.'/*, () => {
        // const controller = new ImageCreationController(config);
        // const reqParams: RequestParameters = {
        //     term: 'test',
        //     text: 'This is a text.',
        //     lang: PossibleLanguages.GERMAN,
        //     preMadeBackground: 'sang.jpg',
        //     style: { color: 'black', frameWidth: 50 }
        // };

        // expect(async () => {
        //     await controller.executeRequest('thisisatestfile.png', reqParams, () => {
        //         console.log('Missing parameter done.');
        //     });
        // }).to.throw();
        // // controller.executeRequest('thisisatestfile.png');
    }*/);

    it('Should create an image on correct parameters.');
});