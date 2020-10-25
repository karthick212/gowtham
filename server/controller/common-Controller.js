const dbconfig = require('../config/db')
const Request = require("request");
const jwt = require("jsonwebtoken");
SECRET_KEY = "thisismysecretkey";

var CommonController = {
	todaydate() {
		var date = new Date();
		let todate = new Date().toLocaleString("en-US", {timeZone: "Asia/Kolkata"});
		todate = new Date(todate);
		return todate;
	},
	QueryExecuteWT(req,qry,args)
	{
		let ResMsg={}
		return new Promise((res,rej)=>{
			jwt.verify(req.token,SECRET_KEY,(err,auth)=>{
				if(err) return res('Token Failed..!!');
				else {
					dbconfig.query(qry,args,(err,rows)=>{
						if (err) {
							ResMsg.status="failed"
							ResMsg.data=err
							return rej(ResMsg);
						}
						else {
							ResMsg.status="success"
							ResMsg.data=rows					
							return res(ResMsg)
						}
					})
				}

			})			
		})
	},
	QueryExecute(qry,args)
	{
		let ResMsg={}
		return new Promise((res,rej)=>{			
			dbconfig.query(qry,args,(err,rows)=>{
				if (err) {
					ResMsg.status="failed"
					ResMsg.data=err
					return rej(ResMsg);
				}
				else {
					ResMsg.status="success"
					ResMsg.data=rows					
					return res(ResMsg)
				}
			})							
		})
	},
	LogData(loginid,formname,primarycode,action){
		let todate=this.todaydate();
		let arr=[loginid,todate,formname,primarycode,action]
		let qry='INSERT INTO `tbllogs` (`UserID`, `LogDate`, `PageName`, `PrimaryCode`, `Action`) VALUES (?, ?, ?, ?, ?)';
		return this.QueryExecute(qry,arr).then(res=>{
			if(res.data.affectedRows>0) return 'success'
				else return 'failed'
			}).catch(err=>{
				console.log(err)
			})
	}
}

module.exports = CommonController;

