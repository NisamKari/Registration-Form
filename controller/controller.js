var connect        =         require("../services/database")

function signup(req, res, callback) {
	connect.select('email = \'' +req.body.email + '\'', function (err, data) {
    req.session.email = req.body.email;
    req.session.name = req.body.firstname;
    if (err) throw err
    if (data.length == 0) {
      connect.insert(req);
      callback(true, "ok");
    } else  {
     callback(false,"Already existinig mail id");
    }
  });
}

function getStatus(req, res, callback){
  var email = req.session.email;
  var name = req.session.firstname;
    connect.selectStatus( function (err, data) {
    var array = [];
    for (var j = 0; j < data.length; j++) {
      if (data[j].email == email && data[j].files == null) {
        array.push({
          status: data[j].status,
          date_time: data[j].date,
        });
      }
    if (data[j].email == email && data[j].status == null) {
      array.push({files: data[j].files});
    }
  }
    callback(array.reverse());
  });
}

function status(req, res, callback) {
  var email = req.session.email
  var name = req.session.firstname
  connect.insertStatus(req, email);
  connect.selectStatus( function (err, data) {
    var array = [];
    var array_date = [];
    for (var j = 0; j < data.length; j++) {
      if(data[j].email == email) {
        array.push(data[j].status);
        array_date.push(data[j].date)
      }
    }
    callback(true)
  });
}
 
function login(req, res, callback) {
  connect.select('email = \'' +req.body.email + '\'', function (err, data) {
    if (err) throw err
   if (data.length > 0) {
    if ( data[0].password === req.body.password) { 
          req.session.email = data[0].email;
          req.session.name = data[0].firstname;
          req.session.path = data[0].pic;
          callback(true, 'Logged In')
    } else {
      callback(false, 'Invalid Password')
    }
  } else {
    callback(false, 'Invalid email')
  }
  });   
}

module.exports = {
	signup: signup,
	login: login,
  status: status,
  getStatus: getStatus,
  // getFile: getFile
}
