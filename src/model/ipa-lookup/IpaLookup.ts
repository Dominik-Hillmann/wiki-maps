// Libraries
import axios, { AxiosInstance } from 'axios';
// Other compontents
import PossibleLanguages from '../PossibleLanguages';



export default class IpaLookup {
    private readonly lang: PossibleLanguages;
    private readonly agent: AxiosInstance;
    private readonly deRegex: RegExp = /<dd>IPA: \[<span>(.*?)<\/span>\]/g;
    private readonly enRegex: RegExp = /IPA<sup>\(key\)<\/sup>: <span>\/(.*?)\/<\/span>/g;

    constructor(lang: PossibleLanguages) {
        this.lang = lang;
        this.agent = axios.create({
            baseURL: `https://${this.lang}.wiktionary.org/w`.replace(/\s/g, ''),
            timeout: 10000,
            transformResponse: res => res
        });
    }

    /**
     * 
     * @param term Because axios would add trailing slash
     */
    private constructLocator(term: string): string {
        return '/api.php?' +
            'action=query&' +
            'format=json&' +
            'prop=extracts&' +
            `titles=${term}`;
    }
    
    /**
     * 
     * @param wiktionarySiteHtml 
     * @returns 
     * @throws {Error}
     * @throws {TypeError}
     */
    private extractPhonetics(wiktionarySiteHtml: string): string[] {
        const noPattern: Error = new Error('Pattern did not match any part of the string.');

        if (this.lang === PossibleLanguages.GERMAN) {
            const matched = this.deRegex.exec(wiktionarySiteHtml);
            if (matched === null) {
                throw noPattern;
            }

            return matched[1].split('|');

        } else if (this.lang === PossibleLanguages.ENGLISH) {
            const matched = this.enRegex.exec(wiktionarySiteHtml);            
            if (matched === null) {
                throw noPattern;
            }

            return matched[1].split('|');

        } else {
            throw new TypeError(`Language ${this.lang} not supported.`);
        }
    }

    private async makeWiktionaryRequest(word: string): Promise<string> {
        return new Promise<string>(async (resolve, reject) => {
            try {
                const resourceLocator = this.constructLocator(word);
                const response = await this.agent.get<string>(resourceLocator);

                if (response.status !== 200) {
                    reject(`Status code ${response.status} for request of ${word}.`);
                }

                resolve(response.data);
            } catch (err) {
                reject(err);
            }
        });
    }

    public async getPhonetics(word: string): Promise<string> {
        return new Promise(async (resolve, reject) => {
            try {
                const wiktionaryData: string = await this.makeWiktionaryRequest(word);
                let phonetics: string = this.extractPhonetics(wiktionaryData)[0];
                resolve(this.toUnescaped(phonetics));
            } catch (err) {
                reject(err);
            }
        });
    }

    private toUnescaped(s: string): string {
        return unescape(s.replace(/\\u/g, '%u'));
    }

    /**
     * If several words need to be resolved at once.
     * Use `Promisea.all([...])`
     * @param words 
     * @returns 
     */
    public async getSeveralPhonetics(words: string | string[]): Promise<string | string[]> {
        throw new Error('Not yet implemented.');
        return new Promise<string | string[]>((resolve, reject) => {
            try {
                resolve('');
            } catch (err) {
                reject(err);
            }
        });
    }
}