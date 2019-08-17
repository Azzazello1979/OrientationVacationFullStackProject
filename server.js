'use strict';


//const Joi = require('joi');
//const validator = require('express-joi-validation')({});
const cors = require('cors');
const express = require('express');
const app = express();
const mysql = require('mysql');
require('dotenv').config();
//const path = require('path');
const PORT = 5000;

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

//require('./startup/prod')(app); // preparing for heroku

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));


// TEST SERVER
app.get('/test', (req, res) => {
  res.send('OK...backend connected to frontend')
});

// modules & middlewares & db connection
// write BELOW this line



// delete record from any table based on ID
app.delete('/delete/:table/:id', (req, res) => {
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


// show all PARTS from db on index page
app.get('/parts', (req, res) => {
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







// update any data in any table
app.put('/post/:table/:id/:column/:newValue', (req, res) => {
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

// you send key-value pairs in the req.body, but instead you can also send
// info in the URL: req.query & req.params
// sending key-value pair in the URL is req.query
app.post('/post', (req, res) => {
  let reqObj = req.query;
  res.status(200).send(reqObj);
})

// sending a single value in the URL is req.params
app.post('/post/:requestParameter', (req, res) => {
  let requestParameter = req.params.requestParameter;
  res.status(200).send(requestParameter);
})



// insert record into CUSTOMERS table
app.post('/customers', (req, res) => {
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


// insert record into CAR table (car records are not unique!)
app.post('/cars', (req, res) => {
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
})


// insert record into PARTS table. ( specify partName, universalCode, starting stock in request )
app.post('/parts', (req, res) => {
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

    }
  );





}

);

























// write ABOVE this line
// EXPRESS connection check & MYSQL db connection check

db.connect((err) => {
  if (err) {
    console.log('Error connecting to DB');
    return;
  }
  console.log('OK...MySQL connection established');
});

app.listen(PORT, () => {
  console.log(`OK...Express listening on ${PORT}`);
});
