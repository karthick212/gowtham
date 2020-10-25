const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
SECRET_KEY = "thisismysecretkey";
var multer = require('multer')
var sftpStorage = require('multer-sftp')
var FTPStorage = require('multer-ftp')

var dbconfig = require('../config/db')
const common = require('../controller/common-Controller')

// var storage = sftpStorage({
//   sftp: {
//     host: 'freelancetypers.com',
//     port: 21,
//     username: 'u997951005',
//     password: 'Karthik212'
//   },
//   destination: function (req, file, cb) {
//     cb(null, '/images/work')
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.fieldname + '-' + Date.now())
//   }
// })

// var storage = new FTPStorage({
//   ftp: {
//     host: 'freelancertypers.com',
//     secure: true, // enables FTPS/FTP with TLS
//      port: 21,
//     user: 'u997951005',
//     password: 'Karthik212'
//   },
//   destination: function (req, file, cb) {
//     cb(null, '/public_html/images/work')
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.fieldname + '-' + Date.now())
//   }
// })

// var upload = multer({ storage: storage })
//Hits
router.get('/Hits', (req, res, err) => {
  let data = req.query
  let cond = ""
  let param = []
  console.log(data.id)
  if (data.id !== undefined) {
    cond = " and id=?"
    param = [data.id]
  }
  common.QueryExecute("select * from vw_hits where hits<>0" + cond, param).then(result => {
    res.json(result);
  }).catch(err => {
    res.json(err)
  })
});


//Works Master
router.get('/Works', (req, res, err) => {
  let data = req.query
  let cond = ""
  let param = []
  console.log(data.id)
  if (data.id !== undefined) {
    cond = " and id=?"
    param = [data.id]
  }
  common.QueryExecute("select * from vw_work where isActive<>0" + cond, param).then(result => {
    res.json(result);
  }).catch(err => {
    res.json(err)
  })
});

router.post('/Works/Add', (req, res, err) => {
  let val = req.body;
  console.log(val)
  let qry = "INSERT INTO `tblwork` (`requesterid`, `startDate`, `expireDate`, `fileName`, `filePath`, `isActive`, `isFinish`, `isAccept`) VALUES (?,?,?,?,?,?,?,?)"
  let param = [val.requesterid, val.startdate, val.expiredate, val.filename, '/images/work/' + val.filename, 1, 0, 0]

  common.QueryExecute(qry, param).then(result => {
    let id = result.data.insertId
    common.LogData(val.userid, 'Works', id, 'Add').then(res1 => {
      res.json(result);
    })
  }).catch(err => {
    console.log('err',err)
  })
});

router.post('/Works/Update', (req, res, err) => {
  let val = req.body;
  let todate = common.todaydate();
  let qry = "Update `tblwork` set `requesterid`=?, `startDate`=?, `expireDate`=?, `fileName`=?, `filePath`=? where id=?"
  let param = [val.requesterid, val.startdate, val.expiredate, val.filename, '/images/work/' + val.filename, val.id]

  if (val.action === 'del') {
    qry = "Update tblwork set isActive=0 where id=?"
    param = [val.id]
  }

  common.QueryExecute(qry, param).then(result => {
    common.LogData(val.userid, 'Works', val.id, val.action).then(res1 => {
      res.json(result);
    })
  }).catch(err => {
    console.log(err)
  })
});


router.get('/Requesters/Auto', (req, res, err) => {
  var itemss = dbconfig.query("select ifnull(max(ID),0)+1 as id from tblrequester", function (err, result, fields) {
    if (err) {
      res.json(err);
    } else {
      res.json(result);
    }
  });
});

//Requesters Master
router.get('/Requesters', (req, res, err) => {
  let data = req.query
  let cond = ""
  let param = []
  console.log(data.id)
  if (data.id !== undefined) {
    cond = " and id=?"
    param = [data.id]
  }
  common.QueryExecute("select * from tblrequester where isActive<>0" + cond, param).then(result => {
    res.json(result);
  }).catch(err => {
    res.json(err)
  })
});

router.post('/Requesters/Add', (req, res, err) => {
  let val = req.body;
  let todate = common.todaydate();
  let qry = "INSERT INTO `tblrequester` (`ID`, `RequesterName`, `Title`, `Description`, `Reward`, `TimeAllotted`, `WorkerType`, `isActive`, `sdate`) VALUES (?,?,?,?,?,?,?,?,?);"
  let param = [val.id, val.requester, val.title, val.description, val.reward, val.timeallotted, val.workertype, 1, todate]

  common.QueryExecute(qry, param).then(result => {
    common.LogData(val.userid, 'Requesters', val.id, 'Add').then(res1 => {
      res.json(result);
    })
  }).catch(err => {
    console.log(err)
  })
});

router.post('/Requesters/Update', (req, res, err) => {
  let val = req.body;
  let todate = common.todaydate();
  let qry = "Update `tblrequester` set `RequesterName`=?, `Title`=?, `Description`=?, `Reward`=?, `TimeAllotted`=?, `WorkerType`=?, `sdate`=? where ID=?"
  let param = [val.requester, val.title, val.description, val.reward, val.timeallotted, val.workertype, todate, val.id]

  if (val.action === 'del') {
    qry = "Update tblrequester set isActive=0 where id=?"
    param = [val.id]
  }

  common.QueryExecute(qry, param).then(result => {
    common.LogData(val.userid, 'Requesters', val.id, val.action).then(res1 => {
      res.json(result);
    })
  }).catch(err => {
    console.log(err)
  })
});


//Users Master
router.get('/Users', (req, res, err) => {
  let data = req.query
  let cond = ""
  let param = []
  if (req.query.id == undefined) {
    cond = " and id=?"
    param = [data.id]
  }
  if (req.query.email == undefined) {
    cond = " and Email=?"
    param = [data.email]
  }
  common.QueryExecute("select * from tblusers where isActive<>0" + cond, param).then(result => {
    res.json(result);
  }).catch(err => {
    res.json(err)
  })
});

router.post('/Users/Add', (req, res, err) => {
  let val = req.body;
  let todate = common.todaydate();
  let qry = "INSERT INTO `tblusers` (`Name`, `Email`, `Password`, `isActive`, `Sdate`) VALUES (?, ?, ?, ?, ?);"
  let param = [val.username, val.email, val.password, 1, todate]

  common.QueryExecute(qry, param).then(result => {
    let id = result.data.insertId
    common.LogData(val.userid, 'Users', id, 'Add').then(res1 => {
      res.json(result);
    })
  }).catch(err => {
    console.log(err)
  })
});

router.post('/Users/Update', (req, res, err) => {
  let val = req.body;
  let qry = "Update `tblusers` set `Name`=?, `Email`=?, `Password`=?, `Country`=?, `Fullname`=?, `Address1`=?, `Address2`=?, `Address3`=?, `City`=?, `State`=?, `Zipcode`=?, `Mobile`=?, `HearAbout`=?, `PrimaryReason`=?, `WorkerID`=? where id=?"
  let param = [val.username, val.email, val.password, val.country, val.fullname, val.address1, val.address2, val.address3, val.city, val.state, val.zipcode, val.mobile, val.hearabout, val.primaryreason, val.workerid, val.id]
  if (val.action === 'worker') {
    qry = "Update `tblusers` set `Country`=?, `Fullname`=?, `Address1`=?, `Address2`=?, `Address3`=?, `City`=?, `State`=?, `Zipcode`=?, `Mobile`=?, `HearAbout`=?, `PrimaryReason`=? where id=?"
    param = [val.country, val.fullname, val.address1, val.address2, val.address3, val.city, val.state, val.zipcode, val.mobile, val.hearabout, val.primaryreason, val.id]
  }
  else if (val.action === 'del') {
    qry = "Update tblusers set isActive=0 where id=?"
    param = [val.id]
  }

  common.QueryExecute(qry, param).then(result => {
    common.LogData(val.userid, 'Users', val.id, val.action).then(res1 => {
      res.json(result);
    })
  }).catch(err => {
    console.log(err)
  })
});

router.post("/login", (req, res) => {
  let val = req.body
  let cond = " and PASSWORD=? and (mobile=? or email=?)"
  let param = [val.password, val.username, val.username]
  let resMsg = {}
  common.QueryExecute("select * from tblusers where isActive<>0" + cond, param).then(result => {
    if (result.data.length > 0) {
      let userdata = result.data[0]
      resMsg.userid = userdata.id
      resMsg.email = val.email
      resMsg.mobile = userdata.mobile

      res.json({ status: 'success', data: resMsg });
    }
    else res.json({ status: 'failed', data: 'Email/Password not exist..!!' })
  }).catch(err => {
    console.log(err)
  })
});

function EmployeeSerial() {
  let qry = "select ifnull(max(employeeserial),0)+1 as id from tblemployees";
  return common.QueryExecuteWOT(qry).then(res => {
    return res.data[0].id;
  }).catch(err => {
    console.log(err)
  })
}

function FormatNumberLength(num, length) {
  var r = "" + num;
  while (r.length < length) {
    r = "0" + r;
  }
  return r;
}

function verifyToken(req, res, next) {
  const header = req.headers['auth'];
  if (typeof header !== 'undefined') {
    req.token = header;
    next();
  }
  else {
    res.json({ status: 'failed', data: 'Token failed' });
  }
}
module.exports = router;
