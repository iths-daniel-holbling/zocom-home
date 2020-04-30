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