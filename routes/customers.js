const db = require('../dbConnection');
const express = require('express');
const router = express.Router();

// insert record into CUSTOMERS table
router.post('/', (req, res) => {
  // 1st lets see if customer with this email already exists (email is the uniq identifier for customer)
  db.query(`SELECT * FROM customers WHERE email = "${req.body.email}"`,
    (err, rows) => {
      if (err) {
        //console.log('DB error with SELECT');
        return res.status(500).json(err);
      } else {
        //console.log(rows);
        if (rows.length > 0) {
          //console.log('A customer with the same email is already registered, please choose a different email');
          return res.status(400).json({ 'message': 'A customer with the same email is already registered, please choose a different email' });
        } else {
          db.query(`INSERT INTO customers (first_name, last_name, address, country, city, state, email) VALUES ( "${req.body.first_name}", "${req.body.last_name}", "${req.body.address}", "${req.body.country}", "${req.body.city}", "${req.body.state}", "${req.body.email}" );`,
            (err, OKPacket) => {
              if (err) {
                //console.log('DB error with INSERT INTO');
                return res.status(500).json(err);
              } else {
                res.status(200).json({ info: 'OK...new customer record inserted.' });
                //console.log(OKPacket);
              }
            }
          )
        }
      }
    }
  )
});

module.exports = router;
