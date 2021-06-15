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

const port = /*process.env.PORT ||*/ 5000;
app.listen(port, () => console.log(`Listening on port ${port}`));
