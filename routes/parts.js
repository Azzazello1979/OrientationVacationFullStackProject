const db = require('../dbConnection');
const express = require('express');
const router = express.Router();

// insert record into PARTS table. ( specify partName, universalCode, starting stock in request )
router.post('/', (req, res) => {
  // first lets see if a part with the same universalCode already exists, because the we refuse insertion
  db.query(`SELECT * FROM parts WHERE universalCode = ${req.body.universalCode}`,
    (err, rows) => {
      if (err) {
        return res.status(500).json(err);
      } else {
        if (rows.length > 0) { // IMPORTANT !!! it is spelled: length
          return res.status(400).json({ info: 'A part with this universal code already exists, please use a different code!' });
        } else {
          db.query(`INSERT INTO parts (partName, universalCode, stock, partPrice) VALUES( "${req.body.partName}", ${req.body.universalCode}, ${req.body.stock}, ${req.body.partPrice} );`,
            (err, OKPacket) => {
              if (err) {
                res.status(500).json(err);
              } else {
                res.status(200).json({ info: 'OK...new record inserted!' });
              }
            }
          );

        }
      }

    });

});



// show all PARTS from db on index page
router.get('/', (req, res) => {
  db.query('SELECT * FROM parts',
    (err, records) => {
      if (err) {
        res.status(500).json(err);
      } else {
        res.status(200).json(records);
      }
    }
  );
});

module.exports = router;
