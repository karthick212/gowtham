const express = require("express");
const body_parser = require("body-parser");
const cors = require("cors");
const jwt = require('jsonwebtoken');
const app = express(),
config = require('./server/config/db'),
masterRoutes = require('./server/routes/master');

config.connect(function(err) {  
  if (err) throw err
  console.log('You are now connected...')
})
      app.use(function(req,res,next){
        res.header("Access-Control-Allow-Origin","*");
        res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept, Authorization, sid");
        res.header("Access-Control-Allow-Methods","GET, POST, PUT, OPTIONS, DELETE");
        next();
      })
      app.use(express.static('public'));
      app.use(body_parser.json({limit: '50mb'}));
      app.use(body_parser.urlencoded());      
      app.use(cors());
      app.use('/api', masterRoutes);
      const port = process.env.PORT || 4000;

      const server = app.listen(port, function(){
        console.log('Listening on port ' + port);
      });
