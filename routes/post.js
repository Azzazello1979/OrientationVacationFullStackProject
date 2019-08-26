
const express = require('express');
const router = express.Router();

// this endpoint is only for education and testing ...


// you send key-value pairs in the req.body, but instead you can also send
// info in the URL: req.query & req.params
// sending key-value pair in the URL is req.query
router.post('/', (req, res) => {
  let reqObj = req.query;
  res.status(200).send(reqObj);
})

// sending a single value in the URL is req.params
router.post('/:requestParameter', (req, res) => {
  let requestParameter = req.params.requestParameter;
  res.status(200).send(requestParameter);
})

module.exports = router;
