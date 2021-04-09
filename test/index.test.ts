import { describe, it } from 'mocha';
import chai from 'chai';
const expect = chai.expect;

describe('This is a test suite.', () => {
    it('This is a concrete test', () => {
        expect(1).to.eq(3 - 2)
    });
});
