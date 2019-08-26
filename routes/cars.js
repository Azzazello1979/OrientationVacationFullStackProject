
const db = require('../dbConnection');
const express = require('express');
const router = express.Router();

// insert record into CAR table (car records are not unique!)
router.post('/', (req, res) => {
  db.query(`INSERT INTO cars ( make, model, year, price, stock, description ) VALUES ( "${req.body.make}",
  "${req.body.model}", ${req.body.year}, ${req.body.price}, ${req.body.stock}, "${req.body.description}" );`,
    (err, OKpacket) => {
      if (err) {
        //console.log(err.message);
        res.status(500).json(err);
      } else {
        //console.log(OKpacket);
        return res.status(200).json({ info: 'OK ... new car record inserted.' });
         
      }
    }
  )
});

//show all cars
router.get('/', (req, res) => {
  db.query(
    `SELECT * FROM cars;`, (err, rows) => {
      if(err){
        //console.log(err.message);
        res.status(500).json(err);
      } else {
        //console.log(rows);
        res.status(200).json(rows);
      }
    }
  );
});


module.exports = router;
