const express = require("express");
const body_parser = require("body-parser");
const cors = require("cors");
const jwt = require('jsonwebtoken');
var cron = require('node-cron');
const app = express(),
  config = require('./server/config/db'),
  masterRoutes = require('./server/routes/master');
const common = require('./server/controller/common-Controller')

config.connect(function (err) {
  if (err) throw err
  console.log('You are now connected...')
})
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, sid");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, OPTIONS, DELETE");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Max-Age", "1000000000");
  next();
})

app.use(express.static('public'));
app.use(body_parser.json({ limit: '50mb' }));
app.use(body_parser.urlencoded());
app.use(cors());
app.use('/api', masterRoutes);
cron.schedule('*/7 * * * *', () => {
  common.QueryExecute("UPDATE `tbluserwork` SET isPending=0,isAccept=1 WHERE ispending=1").then(result => {
    //     SELECT count(*) count,b.timeformat,b.email from tbluserwork as a,vw_usertime as b where date_format(a.time,'%Y %c %e %H %i')=b.timeformat and a.email=b.email
    // GROUP BY b.email,b.timeformat
    // having COUNT(*)>1

        // select * from tbluserwork where date_format(time,'%Y %c %e %H %i') in (
    //   select timeformat from ( SELECT count(*) count,b.timeformat,b.email from tbluserwork a,vw_usertime b where date_format(a.time,'%Y %c %e %H %i')=b.timeformat and a.email=b.email
    //   GROUP BY b.email,b.timeformat having COUNT(*)>1) as d) and email in (select email from (
    //   SELECT count(*) count,b.timeformat,b.email from tbluserwork a,vw_usertime b where date_format(a.time,'%Y %c %e %H %i')=b.timeformat and a.email=b.email GROUP BY b.email,b.timeformat having COUNT(*)>1) as d)
    
    // res.json(result);
  }).catch(err => {
    console.log(err)
  })
  // console.log('running a task every two minutes');
});
const port = process.env.PORT || 4000;

const server = app.listen(port, function () {
  console.log('Listening on port ' + port);
});
