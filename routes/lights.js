const { Router } = require('express');
const router = new Router();
const { db, update } = require('./../db'); // iom index.js så behöver vi inte speca filnamnet

// POWER
router.get('/:id/power/:state', async (req,res) => {
    let id = req.params.id;
    let state = (req.params.state === 'on') ? true : false;

    // Update DB
    db.get( 'devices' ) // ur databasen 'devices'
    .find({ id: id }) // hitta raden med id: id
    .assign({ on: state }) // ändra parametern "on" till state-värdet
    .value(); // utför ändringen

    update(); // Update device frontend

    console.log(`${req.params.id} is now ${req.params.state}`)

    res.send({
        msg: `Light with id: ${req.params.id} is now ${req.params.state}`
    })
})

// COLOR
router.get('/:id/color/:val', async (req,res) => {
    let id = req.params.id;
    let val = req.params.val;

    // Update DB
    db.get('devices')
    .find({id:id})
    .assign({color:`#${val}`})
    .value();

    update(); // Update device frontend

    console.log(`Color on ${req.params.id} is now #${req.params.val}`);

    res.send({
        msg: `Color on light with id: ${req.params.id} is now #${req.params.val}`
    })
})

// BRIGHTNESS
router.get('/:id/brightness/:val', async (req,res) => {
    let id = req.params.id;
    let val = req.params.val;

    // Update DB
    db.get('devices')
    .find({id:id})
    .assign({brightness:val})
    .value();

    update(); // Update device frontend

    console.log(`Brightness on ${req.params.id} is now ${req.params.val*100}%`);

    res.send({
        msg: `Brightness on light with id: ${req.params.id} is now ${req.params.val*100}%`
    })
})


// EXPORT
module.exports = router;