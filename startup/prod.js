// all the middleware you need for production goes here

const helmet = require('helmet');
const compression = require('compression');

module.exports = function(app){
  app.use(helmet());
  app.use(compression());
}
