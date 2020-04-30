const { Router } = require('express');
const router = new Router();
const { db, update } = require('./../db'); // iom index.js så behöver vi inte speca filnamnet

router.get('/:id/:state', async (req,res) => {
    let id = req.params.id;
    let state = (req.params.state === 'on') ? true : false;

    // update db
    db.get( 'devices' ) // ur databasen 'devices'
    .find({ id: id }) // hitta raden med id: id
    .assign({ on: state }) // ändra parametern "on" till state-värdet
    .value(); // utför ändringen



    // Säg åt frontend att uppdatera
    update();

    res.send({
        msg: `AC with id: ${req.params.id} is now ${req.params.state}`
    })
})

// EXPORT
module.exports = router;