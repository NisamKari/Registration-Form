var mysql		   = 		   require("mysql");

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "mydb"
});

function select(condition, callback) {
  const query = 'SELECT * FROM users WHERE ' + condition;
  con.query(query, function(err, rows) {
    if(err) throw err;
    callback(null, rows);

  });
}

function selectStatus(callback) {
  con.query('SELECT * FROM status',function(err, rows) {
    if(err) throw err;
    callback(null, rows);

  });
}

function insert(req) {
  employee = { firstname: req.body.firstname, email: req.body.email, password: req.body.password };
  con.query('INSERT INTO users SET ?', employee, function(err,res) {
    if(err) throw err;
  });
}

function insertImage(path,email_id) {
  con.query('UPDATE users SET pic = ? WHERE email = ?', [path, email_id]);
}

function insertFile(sess, filename) {
  file = {email: sess.email, files: filename };
  con.query('INSERT INTO status SET ?', file, function(err,res) {
    if(err) throw err;
  });
}

function insertStatus(req, email_id) {
  var currentdate = new Date(); 
  var hours = currentdate.getHours()
  var minutes = currentdate.getMinutes()
  if (minutes < 10) 
  minutes = "0" + minutes
  var suffix = "AM";
  if (hours >= 12) {
    suffix = "PM";
    hours = hours - 12;
  }
    if (hours == 0) {
    hours = 12;
  }
  var datetime =   currentdate.getDate()  + "-"+ (currentdate.getMonth()+1)  + "-"+ currentdate.getFullYear() +" "
  + hours + ":" + minutes +" "+ suffix;
  status = {email: email_id, status: req.body.status, date: datetime };
  con.query('INSERT INTO status SET ?', status, function(err,res) {
    if(err) throw err;
  });
}

module.exports = {
 select: select,
 insert: insert,
 selectStatus:  selectStatus,
 insertStatus: insertStatus,
 insertFile: insertFile,
 con: con,
 insertImage: insertImage
}
