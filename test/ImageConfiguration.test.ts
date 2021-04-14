// Libraries
import { describe, it } from 'mocha';
import chai from 'chai';
const expect = chai.expect;
// Components
import ImageConfigration from '../src/model/ImageConfiguration';

describe('Test the ImageConfigration class.', () => {
    const testName = 'test';
    const testArea = {
        xFrom: 1,
        xTo: 100,
        yFrom: 1,
        yTo: 100
    };

    it('Should instantiate correctly on correct parameters.', () => {
        const config = new ImageConfigration({
            filename: testName,
            cutoutArea: testArea
        });

        expect(config.filename).to.eql(testName);
        expect(config.cutoutArea).to.eql(testArea);
    });

    it('Should not instantiate in case of larger "from" values.', () => {
        expect(() => (new ImageConfigration({
            filename: testName,
            cutoutArea: {
                xFrom: 200,
                xTo: 100,
                yFrom: 100,
                yTo: 200
            }
        }))).to.throw(TypeError);

        expect(() => (new ImageConfigration({
            filename: testName,
            cutoutArea: {
                xFrom: 100,
                xTo: 200,
                yFrom: 200,
                yTo: 100
            }
        }))).to.throw(TypeError);
    });

    it('Should not instanciate if there is a non number or NaN in the cutout area', () => {
        expect(() => (new ImageConfigration({
            filename: testName,
            cutoutArea: {
                xFrom: 100,
                xTo: 200,
                yFrom: 100,
                yTo: NaN
            }
        }))).to.throw(TypeError);
    });

    it('Should correctly calculate height and width.', () => {
        const config = new ImageConfigration({
            filename: testName,
            cutoutArea: {
                xFrom: 200,
                xTo: 300,
                yFrom: 2,
                yTo: 3
            }
        });

        expect(config.getHeight()).to.equal(1);
        expect(config.getWidth()).to.equal(100);
    });
});
