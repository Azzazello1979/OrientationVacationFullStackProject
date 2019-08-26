const db = require('../dbConnection');
const express = require('express');
const router = express.Router();

// update any data in any table
router.put('/:table/:id/:column/:newValue', (req, res) => {
  let table = req.params.table;
  let id = req.params.id;
  let column = req.params.column;
  let newValue = req.params.newValue;

  db.query(`SELECT * FROM ${table} WHERE id = ${id}`,
    (err, rows) => {
      if (err) {
        return res.status(500).json(err);
      } else {
        //1st lets check if the selected record (by id) exists or not...
        if (rows.length === 0) {
          return res.status(400).json({ info: 'Sorry, the ID you specified does not exist!' });
          // if it exists, check if it is the partName column that needs to be updated or not, because if so, then this has to be used in
          // query: "${newValue}" ... because partName column is VARCHAR, on the other hand, for any INT types, query has to
          // look like this: ${newValue} ...
        } else {
          if (column === 'partName') { // <--- put all VARCHAR type columns here
            db.query(`UPDATE ${table} SET ${column} = "${newValue}" WHERE id = ${id}`,
              (err, OKPacket) => {
                if (err) {
                  res.status(500).json(err);
                } else {
                  res.status(200).json({ info: 'OK...record updated!' });
                }
              }
            );
          } else { // if INT type ...
            db.query(`UPDATE ${table} SET ${column} = ${newValue} WHERE id = ${id}`,
              (err, OKPacket) => {
                if (err) {
                  res.status(500).json(err);
                } else {
                  res.status(200).json({ info: 'OK...record updated!' });
                }
              }
            );
          }

        }

      }
    }

  );

});

module.exports = router;
