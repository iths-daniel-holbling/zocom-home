const { app } = require('./core'); 

app.listen(3000, () => {
    console.log('API for smart home 1.1 up n running.')
})

const { db, sse, update } = require('./db')

// ROUTES
const acsRoute = require('./routes/acs');
const blindsRoute = require('./routes/blinds');
const camerasRoute = require('./routes/cameras');
const lightsRoute = require('./routes/lights');
const locksRoute = require('./routes/locks');
const vacuumsRoute = require('./routes/vacuums');

// Auth middleware - Check for key
app.use((req,res,next) => {
    if(req.url === '/' || req.url === '/init' || req.url === '/stream'){        
        next();
    }else{        
        // Look for key in header
        let key = req.headers['authorization'];        
        // Get the keys array
        let dbKeys = db.get('keys').value();        
        // Check if key matches with key in array
        if(dbKeys.includes(key)){
            console.log("Auth OK.");
            // Yes >>> next()
            next();
        }else{            
            // No >>> res.status(500).send('No API FOR YOU!')
            res.status(500).send({msg: 'No API FOR YOU!'})
        }
    }
})

// Get list of devices as JSON
app.get('/devicelist', (req,res) => {
    let categories = db.get('categories').value();
    let response = {};
    categories.forEach(category => {
        let devices = db.get('devices').filter({type:category}).value();
        let cat = category.toLowerCase() + "s";
        let devs = []
        devices.forEach(dev => {
            devs.push(dev.id);
        });
        response[cat] = devs;
    });
    res.send(response);
})

// ROUTES
app.use('/acs', acsRoute);
app.use('/blinds', blindsRoute);
app.use('/cameras', camerasRoute);
app.use('/lights', lightsRoute);
app.use('/locks', locksRoute);
app.use('/vacuums', vacuumsRoute);

