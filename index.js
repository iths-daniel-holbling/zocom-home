let { db, sse, update } = require('./db')
let express = require('express');
let cors = require('cors');

const app = express();


app.use(express.json());
app.use(cors());

app.use(express.static('public'))


// ROUTES
const vacuumsRoute = require('./routes/vacuums');


/* CODE YOUR API HERE */

// Auth middleware - Kolla API-nyckel
app.use((req,res,next) => {
    if(req.url === '/' || req.url === '/init' || req.url === '/stream'){
        next();
    }else{
        // kika i headers om API key finns
        let key = req.headers['authorization'];
        
        // Hämta ut databasens keys-array
        let dbKeys = db.get('keys').value();
        
        // kolla ifall den finns i databasen
        if(dbKeys.includes(key)){
            console.log("Auth OK.");

            // Ja >>> next()
            next();
        }else{
            
            // Nej >>> res.status(500).send('No API FOR YOU!')
            res.status(500).send({msg: 'No API FOR YOU!'})
        }
    }
})

// remote -> API -> db -> update() -> frontend

app.use('/vacuums', vacuumsRoute);

/* CODE YOUR API HERE */

app.get('/init', (req, res) => {
    let devices = db.get('devices').value();
    res.send(JSON.stringify({ devices: devices }));
})

app.get('/stream', sse.init);

app.listen(3000, () => {
    console.log('API for smart home 1.0 up n running.')
})