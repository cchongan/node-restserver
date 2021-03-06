require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const fileUpload = require('express-fileupload');

const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json());
console.log('ruta:', path.resolve(__dirname, '../public'));
app.use(express.static(path.resolve(__dirname, '../public')));

// default options
app.use(fileUpload({ useTempFiles: true }));


app.use(require('./routes/index'));


console.log('cadena de conexion:', process.env.URLDB);
console.log('puerto de la aplicacion:', process.env.PORT);

mongoose.connect(process.env.URLDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}, (err) => {
    if (err) {
        throw err;
    } else {
        console.log('Base de datos online');
    }
});

app.listen(process.env.PORT, () => {
    console.log('Escuchando en el puerto:', process.env.PORT);
});