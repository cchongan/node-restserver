//==========================
// Puerto
//=========================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';
process.env.PORT = process.env.PORT || 3000;

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;


//=======================
//  Vencimiento del Token
//=======================
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

//=======================
//  SEED de autenticacion
//=======================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

//=======================
//  Google Client ID
//=======================
process.env.CLIENT_ID = process.env.CLIENT_ID || '226944711952-enfjpo58pt4bunkesja4iatalcujfbr7.apps.googleusercontent.com';