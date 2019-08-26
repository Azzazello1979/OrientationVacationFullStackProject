const db = require('../dbConnection');
const express = require('express');
const router = express.Router();


// delete record from any table based on ID
router.delete('/:table/:id', (req, res) => {
  db.query(`SELECT * FROM ${req.params.table} WHERE id = ${req.params.id}`,
    (err, rows) => {
      if (err) {
        res.status(500).json(err);
      } else {
        if (rows.length === 0) {
          return res.status(400).json({ info: 'The ID you selected for deletion does not exist.' });
        }
        db.query(`DELETE FROM ${req.params.table} WHERE id = ${req.params.id}`,
          (err, OKPacket) => {
            if (err) {
              res.status(500).json(err);
            } else {
              return res.status(200).json({ info: `OK...record number ${req.params.id} deleted. Affected rows: ${OKPacket.affectedRows}` });
            }
          }
        )
      }
    });

});

module.exports = router;
