const common = require('../controller/common-Controller')

var masterController = {
  EmployeeSerial(){
    let qry="select ifnull(max(employeeserial),0)+1 as id from tblemployees";
    return common.QueryExecute(qry).then(res=>{
        return res.data[0].id;
      }).catch(err=>{
        console.log(err)
      })
  }
};

module.exports = masterController;
