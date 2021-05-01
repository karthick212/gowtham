const common = require('../controller/common-Controller')

var masterController = {
  workSerial(email){
    let qry="select ifnull(max(workserial),0)+1 as workserial from tbluserwork where email=?";
    return common.QueryExecute(qry,[email]).then(res=>{
        return res.data[0].workserial;
      }).catch(err=>{
        console.log(err)
      })
  }
};

module.exports = masterController;
