const { Router } = require('express');
const router = new Router();
const { db, update } = require('./../db'); // iom index.js så behöver vi inte speca filnamnet

router.get('/:id/power/:state', async (req,res) => {
    let id = req.params.id;
    let state = (req.params.state === 'on') ? true : false;

    // update db
    db.get( 'devices' ) // ur databasen 'devices'
    .find({ id: id }) // hitta raden med id: id
    .assign({ on: state }) // ändra parametern "on" till state-värdet
    .value(); // utför ändringen

    // Säg åt frontend att uppdatera
    update();

    console.log(`${req.params.id} is now ${req.params.state}`)

    res.send({
        msg: `Light with id: ${req.params.id} is now ${req.params.state}`
    })
})

router.get('/:id/color/:val', async (req,res) => {
    let id = req.params.id;
    let val = req.params.val;

    console.log(val);

    db.get('devices')
    .find({id:id})
    .assign({color:`#${val}`})
    .value();

    update();

    console.log(`Color on ${req.params.id} is now #${req.params.val}`);

    res.send({
        msg: `Color on light with id: ${req.params.id} is now #${req.params.val}`
    })
})

// EXPORT
module.exports = router;