import express, { Express } from 'express';
import { createCanvas, loadImage, registerFont } from 'canvas';
import fs from 'fs';

registerFont(`${__dirname}/../fonts/Josefin_Sans/JosefinSans-VariableFont_wght.ttf`, {
    family: 'Josefin Sans', 
    weight: '400'
});

const app: Express = express();
app.get('/', (req, res) => {
    console.log('Query', req.query);
    console.log('Body', req.body);

    const canvas = createCanvas(2000, 2000)
    const ctx = canvas.getContext('2d')
    
    loadImage(`${__dirname}/../temp/test.png`).then(img => {
        console.log(img);
        ctx.drawImage(img, 0, 0);
        ctx.font = '50px "Josefin Sans"'
        ctx.fillText('Everyone loves this font :)', 50, 50)
        const name = `${__dirname}/../temp/test2.png`;
        const out = fs.createWriteStream(name);
        const stream = canvas.createPNGStream()
        stream.pipe(out)
        out.on('finish', () =>  {
            console.log('The PNG file was created.')
            res.sendFile(name);
            console.log('PNG file sent.')
        });
    }).catch(err => console.timeStamp('test'));

    console.log('GET request done');
});

app.post('/', (req, res) => {
    console.log('Query', req.query);
    console.log('Body', req.body);
    console.log('Header', req.header);
    res.send(JSON.stringify({
        hallo: 1,
        ichBinEinTest: 'hahaha',
        sa: true
    }));
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