// Libraries
import { describe, it } from 'mocha';
import chai from 'chai';
const expect = chai.expect;
// Modules
import IpaLookup from '../src/model/IpaLookup';
import PossibleLanguages from '../src/model/PossibleLanguages';

describe('Test the IpaLookup class.', () => {
    const engLookup = new IpaLookup(PossibleLanguages.ENGLISH);
    const deLookup = new IpaLookup(PossibleLanguages.GERMAN);

    it('Should return existing German word, throw errors on incorrect ones.', async () => {
        expect(await deLookup.getPhonetics('Hund')).to.eql('hʊnt');
        deLookup.getPhonetics('Kabababibi')
            .then(_phonetics => {
                throw new Error();
            })
            .catch();
    });

    it('Should return existing English word, throw errors on incorrect ones.', async () => {
        expect(await engLookup.getPhonetics('cat')).to.eql('kæt');
        engLookup.getPhonetics('Kabababibi')
            .then(_phonetics => {
                throw new Error();
            })
            .catch();
    });
});
