var connect = require("../services/database")
var Q = require('q');

function signup(req, res) {
    req.session.email = req.body.email;
    req.session.name = req.body.firstname;
    var deferred = Q.defer()
    connect.select('email = \'' + req.body.email + '\'').then(function(data) {
        if (data.length == 0) {
            connect.insert(req);
            deferred.resolve({ condition: true, msg: 'signup' });
        } else {
            deferred.resolve({ conditions: false, msg: "Already existing email id" });
        }
    });
    return deferred.promise;
}

function getStatus(req, res) {
    var email = req.session.email;
    var name = req.session.firstname;
    var deferred = Q.defer()
    var array = []
    connect.selectStatus().then(function(data) {
        for (var j = 0; j < data.length; j++) {
            if (data[j].email == email && data[j].files == null) {
                array.push({
                    status: data[j].status,
                    date_time: data[j].date,
                });
            }
            if (data[j].email == email && data[j].status == null) {
                array.push({ files: data[j].files });
            }
        }
        deferred.resolve(array.reverse());
    });
    return deferred.promise;

}

function status(req, res) {
    var email = req.session.email
    var name = req.session.firstname
    var deferred = Q.defer()
    connect.insertStatus(req, email);
    deferred.resolve(true);
    return deferred.promise;

}

function login(req, res) {
    var deferred = Q.defer();
    connect.select('email = \'' + req.body.email + '\'').then(function(data) {
        if (data.length > 0) {
            if (data[0].password === req.body.password) {
                req.session.email = data[0].email;
                req.session.name = data[0].firstname;
                req.session.path = data[0].pic;
                deferred.resolve({ condition: true, msg: 'Logged In' })
            } else {
                deferred.resolve({ condition: false, msg: 'Invalid Password' })
            }
        } else {
            deferred.resolve({ condition: false, msg: 'Invalid email' })
        }
    });
    return deferred.promise;

}

module.exports = {
    signup: signup,
    login: login,
    status: status,
    getStatus: getStatus
}
