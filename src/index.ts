// Express framework and libraries
import express, { Express } from 'express';
import { 
    createCanvas, 
    loadImage,
    Image,
    PNGStream, 
    registerFont 
} from 'canvas';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import Helmet from 'helmet';

// Modules
import ImageCreationController from './controllers/ImageCreationController';
import Configuration from './model/Configuration';
import PossibleLanguages from './model/PossibleLanguages';
import RequestParameters from './view/RequestParameters';
import ParamsChecker from './view/ParamsChecker';

// Settings
const configJson: any = JSON.parse(fs.readFileSync('./config.json').toString());
const config: Configuration = new Configuration(configJson);


registerFont(`${__dirname}/../fonts/Josefin_Sans/JosefinSans-VariableFont_wght.ttf`, {
    family: 'Josefin Sans', 
    weight: '400'
});

registerFont(`${__dirname}/../fonts/NotoSerif/NotoSerif-Regular.ttf`, {
    family: 'Noto Serif',
    weight: '400'
});

const app: Express = express();
app.use(express.static('temp'));
app.use(Helmet()); // Protects against common vulnerabilities.

// import IpaLookup from './model/ipa-lookup/IpaLookup';
// type ExpressionMap = { [key: string]: string; };

// app.get('/lookup', async (_req, res) => {
//     const expressions: string[] = [
//         'Cola', 
//         'Linux', 
//         'Berlin', 
//         'London', 
//         'San Francisco', 
//         'bababadi'
//     ];
        
//     const lookup = new IpaLookup(PossibleLanguages.GERMAN);
//     const re: ExpressionMap = {};

//     // Promise.all(expressions.map(expr => {
//     //     return lookup.getPhonetics(expr);
//     // })).then(results => {
//     //     console.log('RESULTS', results);
//     // }).catch(errs => {
//     //     console.log('ERRS', errs);
//     // });



//     for (const expression of expressions) {
//         // try {
//             let phonetics: string;
//             lookup.getPhonetics(expression)
//                 .then(phon => console.log(expression, 'found:', phon))
//                 .catch(err => console.log(expression, 'NOT found', err.message));
//             // console.log('INDEX', (phonetics));
//             // re[expression] = phonetics;
//             // console.log(expression, 'found:', phonetics);
//         // } catch (err: unknown) {
//             // console.log(err);
//             // re[expression] = 'Did not find.' + (err as Error);
//             // console.log(expression, 'not found');
//         // }
//     }
//     console.log();

//     res.send('');
// });


// app.get('/', (req, res) => {
//     console.log('Query', req.query);
//     console.log('Body', req.body);

//     const canvas = createCanvas(2000, 2000)
//     console.log(canvas);
//     const ctx = canvas.getContext('2d')
    
//     loadImage(`${__dirname}\\..\\temp\\test.jpg`)
//     .then(img => {
//         console.log(img);
//         ctx.drawImage(img, 0, 0);
//         ctx.font = '50px "Josefin Sans"'
//         ctx.fillText('Everyone loves this font :)', 50, 50);


//         const name: string = `${__dirname}/../temp/test2.png`;
//         const out: fs.WriteStream = fs.createWriteStream(name);
//         const stream: PNGStream = canvas.createPNGStream();
//         stream.pipe(out);
//         out.on('finish', () => {
//             console.log('The PNG file was created.')
//             res.sendFile('test2.png', { root: './temp' });
//             console.log('PNG file sent.')
//         });
//     })
//     .catch(err => console.log(err));

//     console.log('GET request done');
// });

const controller = new ImageCreationController(config);

app.post('/', async (req, res) => {
    const outputFilename = `${uuidv4()}.png`;
    console.log(req.query);
    try {
        const checker = new ParamsChecker(req, config);
        if (!checker.areCorrect()) {
            throw new Error(checker.getReason());
        }
    } catch (err) {
        res.status(503).send({ reason: `Wrong parameters: ${err.message}` });
        return;
    }
    const params: RequestParameters = {
        term: req.query.term as string,
        text: req.query.text as string,
        lang: req.query.lang === 'de' ? PossibleLanguages.GERMAN : PossibleLanguages.ENGLISH,
        preMadeBackground: req.query.preMadeBackground as string,
        style: {
            color: req.query.styleColor as 'white' | 'black',
            frameWidth: parseInt(req.query.styleFrameWidth as string)
        }
    };

    console.log('QUERY BACKGROUND', req.query.preMadeBackground, params)
    console.log('Received');
    const imgCallback = () => res.sendFile(outputFilename, { root: './temp' });
    try {
        await controller.executeRequest(outputFilename, params, imgCallback);
        // fs.unlinkSync(`${__dirname}\\temp\\${outputFilename}`);
    } catch (err) {
        res.status(503).send({ reason: err.message });
    } finally {
        console.log('Request done');
    }
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}`));
