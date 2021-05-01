const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
SECRET_KEY = "thisismysecretkey";
var moment = require('moment')

var dbconfig = require('../config/db')
const common = require('../controller/common-Controller')
const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: "/var/www/html/assets/img/topworkers/",
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
}).single('myimage')

//Work summary
router.get('/Worksummary', (req, res, err) => {
  let data = req.query
  common.QueryExecute("select * from vw_worksummary where email<>''").then(result => {
    res.json(result);
  }).catch(err => {
    res.json(err)
  })
});

//Requesters Master
router.get('/Topworkers', (req, res, err) => {
  let data = req.query
  let cond = ""
  let param = []
  if (data.id !== undefined) {
    cond = " and id=?"
    param = [data.id]
  }
  common.QueryExecute("select * from tbltopworkers where isActive<>0" + cond, param).then(result => {
    res.json(result);
  }).catch(err => {
    res.json(err)
  })
});

router.post('/Authentication', (req, res, err) => {
  let val = req.body;

  common.QueryExecute("Select count(*) as cnt from tbladmin where username=? and password=?", [val.username,val.password]).then(result1 => {
    res.json(result1);
  }).catch(err => {
    console.log(err)
  })
});

router.post('/updateSmallamount', upload, (req, res, err) => {
  let val = req.body;

  common.QueryExecute("update `tblusers` set isSmallAmount=1 where email=?", [val.email]).then(result1 => {
    res.json(result1);
  }).catch(err => {
    console.log(err)
  })
});

router.post('/updatepassword', upload, (req, res, err) => {
  let val = req.body;
  common.QueryExecute("update `tblusers` set Password=? where email=?", [val.password,val.email]).then(result1 => {
    res.json(result1);
  }).catch(err => {
    console.log(err)
  })
});

router.post('/Payment', upload, (req, res, err) => {
  let val = req.body;
  let todate = common.todaydate();
  let qry = "INSERT INTO `tblpayment` (`email`, `paymentid`, `paymentdate`, `amount`, `status`) VALUES (?,?,?,?,?);"
  let param = [val.email, val.paymentid, todate, val.amount, val.status]

  common.QueryExecute(qry, param).then(result => {
    common.QueryExecute("insert into tbltransaction (email,transdate,transamount) values(?,?,?)", [val.email, todate, 0.00]).then(result2 => {
      common.QueryExecute("update `tblusers` set isPayment=1 where email=?", [val.email]).then(result1 => {
        common.QueryExecute("delete from `tbluserwork` where email=?", [val.email]).then(result3 => {
          res.json(result1);
        })
      })
    })
  }).catch(err => {
    console.log(err)
  })
});

router.post('/Topworkers/Add', upload, (req, res, err) => {
  let files = req.file
  let val = req.body;
  console.log(files)
  var filepath = "/assets/img/topworkers/" + files.filename
  let todate = common.todaydate();
  let qry = "INSERT INTO `tbltopworkers` (`email`, `username`, `filepath`, `filename`, `isActive`) VALUES (?,?,?,?,?);"
  let param = [val.email, val.username, filepath, files.filename, 1]

  common.QueryExecute(qry, param).then(result => {
    common.LogData(val.userid, 'Topworkers', result.data.insertId, 'Add').then(res1 => {
      res.json(result);
    })
  }).catch(err => {
    console.log(err)
  })
});

router.post('/Topworkers/Update', upload, (req, res, err) => {
  let files = req.file
  let val = req.body;
  var filepath = "/assets/img/topworkers/" + files.filename

  let todate = common.todaydate();
  let qry = "Update `tbltopworkers` set `email`=?, `username`=?, `filepath`=?, `filename`=? where id=?"
  let param = [val.email, val.username, filepath, files.filename, val.id]
  console.log(val)

  if (val.action === 'del') {
    qry = "Update tbltopworkers set isActive=0 where id=?"
    param = [val.id]
  }
  common.QueryExecute(qry, param).then(result => {
    common.LogData(val.userid, 'Topworkers', val.id, val.action).then(res1 => {
      res.json(result);
    })
  }).catch(err => {
    console.log(err)
  })
});

//Userwork
router.get('/contactus', (req, res, err) => {
  let data = req.query
  let cond = ""
  let param = []
  if (data.email !== undefined) {
    cond = " and email=? "
    param = [data.email]
  }
  common.QueryExecute("select * from tblcontactus where email<>''" + cond, param).then(result => {
    res.json(result);
  }).catch(err => {
    res.json(err)
  })
});

router.post('/contactus', (req, res, err) => {
  let val = req.body;
  let date = moment().format('YYYY-MM-DD HH:mm:ss');
  let qry = "INSERT INTO `tblcontactus` (`name`, `email`, `message`, `date`) VALUES (?, ?, ?, ?)"
  let param = [val.name, val.email, val.message, date]

  common.QueryExecute(qry, param).then(result => {
    res.json(result);
  }).catch(err => {
    console.log('err', err)
  })
});


router.get('/amountcombination', (req, res, err) => {
  let data = req.query
  console.log(data)
  let cond = ""
  let param = [data.firstamt, data.secondamt]

  var qry = "select * from tblsmallamount where id<>'0' and firstAmount=? and secondAmount=?" + cond;
  common.QueryExecute(qry, param).then(result => {
    res.json(result);
  }).catch(err => {
    res.json(err)
  })
});

router.get('/hitsyearwise', (req, res, err) => {
  let data = req.query
  let cond = ""
  let param = []
  if (data.email !== undefined) {
    cond = " and email=? "
    param = [data.email]
  }
  var qry = "select * from vw_hitsyearwise where email<>''" + cond;
  common.QueryExecute(qry, param).then(result => {
    res.json(result);
  }).catch(err => {
    res.json(err)
  })
});

router.get('/hitsoverview', (req, res, err) => {
  let data = req.query
  let cond = ""
  let param = []
  if (data.email !== undefined) {
    cond = " and email=? "
    param = [data.email]
  }
  var qry = "select * from vw_hitsoverview where email<>''" + cond;
  common.QueryExecute(qry, param).then(result => {
    res.json(result);
  }).catch(err => {
    res.json(err)
  })
});

router.get('/availableearnings', (req, res, err) => {
  let data = req.query
  let cond = ""
  let param = []
  if (data.email !== undefined) {
    cond = " and email=? "
    param = [data.email]
  }
  var todate = moment().format("YYYY-MM-DD")
  var qry = "select  email,earnings from vw_overviewdate where date<='" + todate + "'" + cond;
  common.QueryExecute(qry, param).then(result => {
    res.json(result);
  }).catch(err => {
    res.json(err)
  })
});

// var upload = multer({ storage: storage })
router.get('/overview', (req, res, err) => {
  let data = req.query
  let cond = ""
  let param = []

  if (data.email !== undefined) {
    cond = " and email=? "
    param = [data.email]
  }
  var todate = moment().format("YYYY-MM-DD")
  // var qry = "select email,date,date_format(date,'%d/%m/%Y') date1,isAccept,isReject,isPending,reward,earnings from vw_overviewdate where date<='" + todate + "' and email='' and email not in ('" + data.email + "') union all select email,date,date_format(date,'%d/%m/%Y') date1,isAccept,isReject,isPending,reward,earnings from vw_overviewdate where date<='" + todate + "'" + cond + " order by date desc limit 10 ";
  var qry = "SELECT id,tbldate.date,date_format(tbldate.date,'%d/%m/%Y') date1,ifnull(email,'" + data.email + "') as email,ifnull(isAccept,0) isAccept,ifnull(isReject,0) isReject,ifnull(isPending,0) isPending,ifnull(reward,0) reward,ifnull(earnings,0) earnings FROM tbldate LEFT JOIN (select * from `vw_overview` where email<>''  and email='" + data.email + "' ) as d on d.date=tbldate.date where tbldate.date<='" + todate + "' order by tbldate.date desc limit 10";
  common.QueryExecute(qry, param).then(result => {
    res.json(result);
  }).catch(err => {
    res.json(err)
  })
});


//Userwork
router.get('/userWorkslimit', (req, res, err) => {
  let data = req.query
  let cond = ""
  let param = []
  if (data.email !== undefined) {
    cond = " and email=? "
    param = [data.email]
  }
  common.QueryExecute("select ifnull(max(workserial),0) as workserial,ifnull((select isPayment from tblusers where Email=tbluserwork.email),0) isPayment from tbluserwork where isActive<>0" + cond, param).then(result => {
    res.json(result);
  }).catch(err => {
    res.json(err)
  })
});

//Userwork
router.get('/userWorks', (req, res, err) => {
  let data = req.query
  console.log(data)
  let cond = ""
  let param = []
  if (data.email !== undefined && data.worktype !== undefined) {
    cond = " and email=? and worktype=?"
    param = [data.email, data.worktype]
  }
  else if (data.email !== undefined && data.filepath !== undefined) {
    cond = " and email=? and filepath=?"
    param = [data.email, data.filepath]
  }
  else if (data.email !== undefined) {
    cond = " and email=? "
    param = [data.email]
  }
  common.QueryExecute("select *,DATE_FORMAT(date,'%d-%m-%Y') as date1,DATE_FORMAT(time,'%l:%i %p') as time1 from tbluserwork where isActive<>0" + cond + " order by id desc", param).then(result => {
    res.json(result);
  }).catch(err => {
    res.json(err)
  })
});

router.post('/userWorks/Add', (req, res, err) => {
  let val = req.body;
  let date = moment().format('YYYY-MM-DD');
  let time = moment().format('YYYY-MM-DD HH:mm:ss');
  let ispending = val.isreject===1?0:1
  workSerial(val.email).then(result => {
    let workserial = result
    let qry = "INSERT INTO `tbluserwork` (`email`, `requesterid`, `reward`, `filename`, `filepath`, `entertext`, `isAccept`, `isReject`, `isPending`, `date`, `time`, `isActive`,workserial,workType) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    let param = [val.email, val.requesterid, val.reward, val.filename, val.filepath, val.entertext, 0, val.isreject, ispending, date, time, 1, workserial, val.worktype]

    common.QueryExecute(qry, param).then(result => {
      let id = result.data.insertId
      common.LogData(val.userid, 'userWorks', id, 'Add').then(res1 => {
        res.json(result);
      })
    }).catch(err => {
      console.log('err', err)
    })

  }).catch(err => {
    console.log(err)
  })
});


router.post('/userWorks/Update', (req, res, err) => {
  let val = req.body;
  var isaccept = 0, isreject = 0, isPending = 0
  if (val.status === "Accepted")
    isaccept = 1
  else if (val.status === "Rejected")
    isreject = 1
  else if (val.status === "Pending")
    isPending = 1
  let qry = "Update `tbluserwork` set `isAccept`=?, `isReject`=?, `isPending`=? where id=?"
  let param = [isaccept, isreject, isPending, val.id]
  console.log(val)
  common.QueryExecute(qry, param).then(result => {
    common.LogData(val.userid, 'userWorks', val.id, 'Update').then(res1 => {
      res.json(result);
    })
  }).catch(err => {
    console.log('err', err)
  })
});

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
  common.QueryExecute("select * from vw_hits where hits<>0" + cond + " order by requesterid desc", param).then(result => {
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
  let qry = "INSERT INTO `tblwork` (`requesterid`, `startDate`, `expireDate`, `fileName`, `filePath`, `isActive`, `isFinish`, `isAccept`) VALUES (?,?,?,?,?,?,?,?)"
  let param = [val.requesterid, val.startdate, val.expiredate, val.filename, '/images/work/' + val.filename, 1, 0, 0]

  common.QueryExecute(qry, param).then(result => {
    let id = result.data.insertId
    common.LogData(val.userid, 'Works', id, 'Add').then(res1 => {
      res.json(result);
    })
  }).catch(err => {
    console.log('err', err)
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
  if (req.query.id !== undefined) {
    cond = " and id=?"
    param = [data.id]
  }
  if (req.query.email !== undefined) {
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
  let wid = shuffle(20)
  let qry = "INSERT INTO `tblusers` (`Name`, `Email`, `Password`,`Mobile`, `isActive`, `Sdate`, WorkerID) VALUES (?, ?, ?, ?, ?, ?, ?);"
  let param = [val.username, val.email, val.password, val.mobile, 1, todate, wid]

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
  let qry = "Update `tblusers` set `Name`=?, `Email`=?, `Password`=?, `Country`=?, `Fullname`=?, `Address1`=?, `Address2`=?, `Address3`=?, `City`=?, `State`=?, `Zipcode`=?,  `HearAbout`=?, `PrimaryReason`=?, `WorkerID`=? where id=?"
  let param = [val.username, val.email, val.password, val.country, val.fullname, val.address1, val.address2, val.address3, val.city, val.state, val.zipcode, val.hearabout, val.primaryreason, val.workerid, val.id]
  if (val.action === 'bank') {
    qry = "Update `tblusers` set `accountname`=?, `accno`=?, `ifsc`=?, `bankname`=? where id=?"
    param = [val.accountname, val.accno, val.ifsc, val.bankname, val.id]
  }
  else if (val.action === 'worker') {
    qry = "Update `tblusers` set `Country`=?, `Fullname`=?, `Address1`=?, `Address2`=?, `Address3`=?, `City`=?, `State`=?, `Zipcode`=?, `HearAbout`=?, `PrimaryReason`=? where id=?"
    param = [val.country, val.fullname, val.address1, val.address2, val.address3, val.city, val.state, val.zipcode, val.hearabout, val.primaryreason, val.id]
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

router.post('/Users/survey', (req, res, err) => {
  let val = req.body;
  let qry = "Update `tblusers` set `survey1`=?, `survey2`=?, `survey3`=?, `survey4`=?, `survey5`=?, `survey6`=?, `company_email`=? where id=?"
  let param = [val.survey1, val.survey2, val.survey3, val.survey4, val.survey5, val.survey6,  val.id]

  common.QueryExecute(qry, param).then(result => {
    common.LogData(val.userid, 'Users', val.id, "update").then(res1 => {
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
      resMsg.email = val.Email
      resMsg.mobile = userdata.Mobile
      resMsg.name = userdata.Name
      resMsg.workerid = userdata.WorkerID

      res.json({ status: 'success', data: resMsg });
    }
    else res.json({ status: 'failed', data: 'Email/Password not exist..!!' })
  }).catch(err => {
    console.log(err)
  })
});

async function workSerial(email) {
  let qry = "select ifnull(max(workserial),0)+1 as workserial from tbluserwork where email=?";
  return common.QueryExecute(qry, [email]).then(res => {
    return Promise.resolve(res.data[0].workserial).catch(err => { Promise.reject(err) })
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
function random_strings($length_of_string) {
  // String of all alphanumeric character 
  $str_result = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

  // Shufle the $str_result and returns substring 
  // of specified length 
  return substring(str_shuffle($str_result),
    0, $length_of_string);
}
function shuffle(leng) {
  var result = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  var parts = result.split('');
  var arr = []
  for (var i = leng; i > 0;) {
    var random = parseInt(Math.random() * result.length);
    var temp = parts[--i];
    parts[i] = parts[random];
    parts[random] = temp;
  }
  arr = parts.slice(0, leng)
  return arr.join('');
}

module.exports = router;

