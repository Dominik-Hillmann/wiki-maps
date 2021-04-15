// Libraries
import axios, { AxiosInstance } from 'axios';
// Other compontents
import PossibleLanguages from '../PossibleLanguages';



export default class IpaLookup {
    private readonly lang: PossibleLanguages;
    private readonly agent: AxiosInstance;
    private readonly deRegex: RegExp = /{{Lautschrift\|(.*?)}}/g;
    private readonly enRegex: RegExp = /{{IPA\|..\|\/(.*?)}}/g;


    // Agents for query and parse?

    constructor(lang: PossibleLanguages) {
        this.lang = lang;
        const test: string = (
            `https://${this.lang}.wiktionary.org/w`
        ).replace(/\s/g, '');
        console.log(test);
        // Axios configuration
        this.agent = axios.create({
            /* baseURL:*/ /*`https://${this.lang}.wiktionary.org/w/api.php?\
            action=query&\
            format=json&\
            page=Linux`*/
            baseURL: test,
            timeout: 10000,
            // transformRequest: req => {
            //     console.log('USING REQUEST:', req);
            //     console.log();
            //     return req;
            // },
            transformResponse: res => res//JSON.parse(res.data)
        });

        this.agent.get(this.constructRequestUrl('Cola')).then(res => {
            // console.log('DATA', typeof res.data, res.data);
            // console.log();
            // console.log('STATUS', res.status);
            // console.log();
            // console.log('STATUS_TEXT', res.statusText);
            // console.log();
            // console.log('HEADERS', res.headers);
            console.log();
            const s: string[] =  this.extractPhonetics(res.data);
            console.log('Cola', s);
            s.forEach(s_ => console.log(decodeURIComponent(s_), decodeURIComponent(s_).length))
        }).catch(err => {
            console.log(err)
        });

        this.agent.get(this.constructRequestUrl('Linux')).then(res => {
            // console.log('DATA', typeof res.data, res.data);
            // console.log();
            // console.log('STATUS', res.status);
            // console.log();
            // console.log('STATUS_TEXT', res.statusText);
            console.log();
            const s: string[] =  this.extractPhonetics(res.data);
            console.log('Linux', s);
            s.forEach(s_ => console.log(decodeURIComponent(s_), decodeURIComponent(s_).length))
        }).catch(err => {
            console.log(err)
        });

        this.agent.get(this.constructRequestUrl('Berlin')).then(res => {
            // console.log('DATA', typeof res.data, res.data);
            // console.log();
            // console.log('STATUS', res.status);
            // console.log();
            // console.log('STATUS_TEXT', res.statusText);
            const s: string[] =  this.extractPhonetics(res.data);
            console.log('Berlin', s);
            s.forEach(s_ => console.log(decodeURIComponent(s_), decodeURIComponent(s_).length))
        }).catch(err => {
            console.log(err)
        });

        this.agent.get(this.constructRequestUrl('BABABADIBABIDIBU')).then(res => {
            // console.log('DATA', typeof res.data, res.data);
            // console.log();
            // console.log('STATUS', res.status);
            // console.log();
            // console.log('STATUS_TEXT', res.statusText);
            console.log();
            const s: string[] =  this.extractPhonetics(res.data);
            console.log('BABABADIBABIDIBU', s);
            s.forEach(s_ => console.log(decodeURIComponent(s_), decodeURIComponent(s_).length))
        }).catch(err => {
            console.log(err)
        });

        this.agent.get(this.constructRequestUrl('London')).then(res => {
            // console.log('DATA', typeof res.data, res.data);
            // console.log();
            // console.log('STATUS', res.status);
            // console.log();
            // console.log('STATUS_TEXT', res.statusText);
            console.log();
            const s: string[] =  this.extractPhonetics(res.data);
            console.log('London', s);
            s.forEach(s_ => console.log(decodeURIComponent(s_), decodeURIComponent(s_).length))
        }).catch(err => {
            console.log(err)
        });

        // !!!
        // https://stackoverflow.com/questions/29462958/unicode-characters-not-rendering-properly-in-html5-canvas


























        // Strategie: zuerst querien, dann alle durchparsen, bis passend
    }

    /**
     * 
     * @param term Because axios would add trailing slash
     */
    private constructRequestUrl(term: string): string {
        return '/api.php?' +
            'format=json&' +
            'action=query&' +
            'prop=revisions&' +
            'rvprop=content&' +
            `titles=${term}`;
    }
    
    /**
     * 
     * @param wiktionarySite 
     * @returns 
     * @throws {Error}
     */
    private extractPhonetics(wiktionarySite: string): string[] {
        const noPattern: Error = new Error('Pattern did not match any part of the string.');

        if (this.lang === PossibleLanguages.GERMAN) {
            const matched = this.deRegex.exec(wiktionarySite);
            if (matched === null) {
                throw noPattern;
            }

            return matched[1].split('|');

        } else if (this.lang === PossibleLanguages.ENGLISH) {
            const matched = this.enRegex.exec(wiktionarySite);            
            if (matched === null) {
                throw noPattern;
            }

            return matched[1].split('|');

        } else {
            throw new TypeError(`Language ${this.lang} not supported.`);
        }
    }

    // https://en.wikipedia.org/w/api.php?action=query&format=json&maxlag=10000&uselang=user&prop=extracts&titles=Pet_door&formatversion=2&exsentences=10&exlimit=1&explaintext=1
    // `transformResponse` allows changes to the response data to be made before
  // it is passed to then/catch
//   transformResponse: [function (data) {
//     // Do whatever you want to transform the data

//     return data;
//   }],

    // private extractIpa(responseData: Ax)

    public async getPhonetics(word: string): Promise<string> {
        return new Promise(async (reject, resolve) => {
            try {
                await setTimeout(() => 1, 1);
            } catch (err) {
                reject(err);
            }
        });
    }
}