const express = require('express');
const path = require('path');
// const nomeApp = process.env.npm_package_name;
const nomeApp = 'cgApp';
const app = express();

app.use(express.static(`${__dirname}/dist/${nomeApp}`));

app.get('/*', (req, res) => {
    res.sendFile(path.join(`${__dirname}/dist/${nomeApp}/index.html`));
});

const PORT = process.env.PORT || 8080;

app.listen(PORT,() => {
    console.log('Servidor iniciado na porta: ', PORT);
})