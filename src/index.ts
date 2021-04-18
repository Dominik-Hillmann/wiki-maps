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
import PossibleStyles from './model/PossibleStyles';
import RequestParameters from './view/RequestParameters';

// Settings
const configJson: any = JSON.parse(fs.readFileSync('./config.json').toString());
const config: Configuration = new Configuration(configJson);
console.log(config);


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

import IpaLookup from './model/ipa-lookup/IpaLookup';
type ExpressionMap = { [key: string]: string; };

app.get('/lookup', async (_req, res) => {
    const expressions: string[] = [
        'Cola', 
        'Linux', 
        'Berlin', 
        'London', 
        'San Francisco', 
        'bababadi'
    ];
        
    const lookup = new IpaLookup(PossibleLanguages.GERMAN);
    const re: ExpressionMap = {};

    // Promise.all(expressions.map(expr => {
    //     return lookup.getPhonetics(expr);
    // })).then(results => {
    //     console.log('RESULTS', results);
    // }).catch(errs => {
    //     console.log('ERRS', errs);
    // });



    for (const expression of expressions) {
        // try {
            let phonetics: string;
            lookup.getPhonetics(expression)
                .then(phon => console.log(expression, 'found:', phon))
                .catch(err => console.log(expression, 'NOT found', err.message));
            // console.log('INDEX', (phonetics));
            // re[expression] = phonetics;
            // console.log(expression, 'found:', phonetics);
        // } catch (err: unknown) {
            // console.log(err);
            // re[expression] = 'Did not find.' + (err as Error);
            // console.log(expression, 'not found');
        // }
    }
    console.log();

    res.send('');
});


app.get('/', (req, res) => {
    console.log('Query', req.query);
    console.log('Body', req.body);

    const canvas = createCanvas(2000, 2000)
    console.log(canvas);
    const ctx = canvas.getContext('2d')
    
    loadImage(`${__dirname}\\..\\temp\\test.jpg`)
    .then(img => {
        console.log(img);
        ctx.drawImage(img, 0, 0);
        ctx.font = '50px "Josefin Sans"'
        ctx.fillText('Everyone loves this font :)', 50, 50);


        const name: string = `${__dirname}/../temp/test2.png`;
        const out: fs.WriteStream = fs.createWriteStream(name);
        const stream: PNGStream = canvas.createPNGStream();
        stream.pipe(out);
        out.on('finish', () => {
            console.log('The PNG file was created.')
            res.sendFile('test2.png', { root: './temp' });
            console.log('PNG file sent.')
        });
    })
    .catch(err => console.log(err));

    console.log('GET request done');
});

const controller = new ImageCreationController(config);

app.post('/', async (req, res) => {
    const outputFilename = `${uuidv4()}.png`;

    const params: RequestParameters = {
        term: 'San Francisco',
        text: 'Das ist ein langer Text.',
        lang: PossibleLanguages.GERMAN,
        preMadeBackground: 'wooden-posts.jpg',
        style: {
            overallStyle: PossibleStyles.standard,
            color: '#ffffff',
            frameWidth: 100,
            writingBorder: 'shadowed'
        }
    };

    console.log('Received');
    await controller.executeRequest(outputFilename, params, () => {
        console.log('Before sending');
        res.sendFile(outputFilename, { root: './temp' });

    });
    console.log('Done');
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});


// const { createCanvas, loadImage } = require('canvas')




// Write "Awesome!"
// ctx.font = '30px Impact'
// ctx.rotate(0.1)
// ctx.fillText('Awesome!', 50, 100)

// // Draw line under text
// var text = ctx.measureText('Awesome!')
// ctx.strokeStyle = 'rgba(0,0,0,0.5)'
// ctx.beginPath()
// ctx.lineTo(50, 102)
// ctx.lineTo(50 + text.width, 102)
// ctx.stroke()

// // Draw cat with lime helmet
// loadImage('examples/images/lime-cat.jpg').then((image) => {
//   ctx.drawImage(image, 50, 0, 70, 70)

//   console.log('<img src="' + canvas.toDataURL() + '" />')
// })