//==========================
// Puerto
//=========================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';
process.env.PORT = process.env.PORT || 3000;

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb+srv://cchong:YRi1o2bTmefhLcI1@cluster0.gw90r.mongodb.net/cafe';
}

process.env.URLDB = urlDB;