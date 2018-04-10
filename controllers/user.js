var commfunc = require('../modules/commonFunction');
var responses = require('../modules/responses');
var UserModal = require('../modals/user');
var md5 = require("md5");
var request = require('request');

/* Controller for user login */ 
exports.login = function(req, res) {
	var { email, password, device_type, device_token, latitude, longitude } = req.body;
   
	var manValues = [email, password, device_type, device_token, latitude, longitude];

	var checkBlank = commfunc.checkBlank(manValues);
	if (checkBlank == 1) {
		responses.parameterMissing(res);
	} else {
		UserModal.checkLoginEmail(email, function(result){
			if (result == 1) {
				responses.sendError(res);
			} else if ( result == 2 ) {
				responses.nodata(res);
			} else {
				var encry_hash = md5(password);
				if (result[0].password != encry_hash) {
					responses.invalidPassword(res);
				} else {

					var access_token = md5(new Date());
					var data = {access_token: access_token, device_type: device_type, device_token: device_token, latitude: latitude, longitude: longitude};
					var condition = {user_id: result[0].user_id};

					UserModal.updateUserData(data, condition, function(updatedResult){
						if (updatedResult == 0) {
							responses.sendError(res);
						} else {
							result[0].access_token = access_token;
							result[0].device_type = device_type;
							result[0].device_token = device_token;
							result[0].latitude = latitude;
							result[0].longitude = longitude;
							result[0].password = "";
							responses.success(res, result[0]);
						}
					});
				}
			}
		});
	}
}
/* Controller for user Signup */ 
exports.create = function(req, res) {
    var {name,email,password,device_type,device_token,latitude,longitude,profile_image} = req.body;
    var manValues = [name, email, password, device_type, device_token, latitude, longitude];

    var checkBlank = commfunc.checkBlank(manValues);
    if (checkBlank == 1) {
        responses.parameterMissing(res);
    } else {
        UserModal.checkSignEmail(email, function(result) {
            if (result == 1) {
                responses.sendError(res);
            } else if (result.length > 0) {
                responses.emailAlreadyExist(res);
            } else {
                var user_id = md5(commfunc.generateRandomString());
                var access_token = md5(new Date());
                var profile_image =req.files[0].filename;
                var data = [user_id, access_token, name, email, md5(password), device_type, device_token, latitude, longitude,profile_image];
                UserModal.createUserData(data, function(err, result) {
                    if (result == 0) {
                        responses.sendError(res);
                    } else {
                        UserModal.selectUserData(user_id, function(err, result) {
                            if (result == 0) {
                                responses.sendError(res);
                            } else {
                                responses.success(res, result);
                            }
                        })
                    }
                })
            }
        })
    }
}
/*controller for forgot password*/
exports.forgetpassword = function(req, res) {

    var email = req.body.email;
    var manValues = [email];

    var checkBlank = commfunc.checkBlank(manValues);
    if (checkBlank == 1) {
        responses.parameterMissing(res);
    } else {
        UserModal.checkSignEmail(email, function(result) {
            if (result == 1) {
                responses.sendError(res);
            } else if (result.length > 0) {
                var otp = commfunc.generateRandomString();
                var data = {otp: otp};
                var condition = {user_id: result[0].user_id};
                UserModal.updateUserData(data, condition, function(updatedResult) {
                    if (updatedResult == 0) {
                        responses.sendError(res);
                    } else {
                        var nodemailer = require("nodemailer");
                        var smtpTransport = require("nodemailer-smtp-transport");

                        var config = {
                            "SMTP_HOST": "smtp.sendgrid.net",
                            "SMTP_PORT": 25,
                            "SMTP_USER": "apikey",
                            "SMTP_PASS": "SG.xQsPEjavTfqsWih82w5MfQ.uGWWWVGbZqTxY4iW2mraWLyBLnYQEreBsA8TAiQM7Ws"

                        }

                        var mailer = nodemailer.createTransport(smtpTransport({
                            host: config.SMTP_HOST,
                            port: config.SMTP_PORT,
                            auth: {
                                user: config.SMTP_USER,
                                pass: config.SMTP_PASS
                            }
                        }));
                        mailer.sendMail({
                            from: "prachisrivastav1412@gmail.com",
                            to: email,
                            cc: "",
                            subject: "Attention Alert Warning",
                            template: "",
                            html: " Your One Time Password is :" + otp
                        }, (error, response) => {
                            if (error) { // resolve({ message: "Email not send " });\
                                console.log(error);
                            } else {
                                console.log(response)
                                // resolve({ message: "Email send successfully" });\
                            }
                            mailer.close();
                        });
                        res.send('otp send');
                    }
                })
            } else {
                responses.nodata(res);
            }
        })
    }
}
/*controller for update password basis of otp*/
exports.passwordUpdate = function(req, res) {
    var {email,new_password,otp} = req.body;
    var manValues = [new_password, otp];
    var checkBlank = commfunc.checkBlank(manValues);
    if (checkBlank == 1) {
        responses.parameterMissing(res);
    } else {
        UserModal.checkotp(otp, function(result) {

            if (result == 1) {
                responses.sendError(res);
            } else if (result == 2) {
                responses.nodata(res);
            } else {
                var password = md5(new_password);
                //var condition = '"email" = "' + result[0].email +'" AND  "otp" = "' +result[0].otp +'"';
               var condition = {email:result[0].email , otp : result[0].otp};
               var email = result[0].email;
               var otp = result[0].otp;
                UserModal.updatePasswordData(password,email,otp, function(updatedResult) { 
                   
                    if (updatedResult == 0) {
                           console.log(updatedResult);
                        responses.sendError(res);
                    } else { 
                        var data = {otp: ""};
                        var condition = {user_id: result[0].user_id};
                        UserModal.updateUserData(data, condition, function(result) {
                            if (result == 0) {
                                responses.sendError(res);
                            } else {
                                 responses.passwordUpdated(res);
                            }
                        })
                    }
                })
            }
        })
    }
}
/*controller for search near by place by google map api*/
exports.search_nearby_place = function(req, res) {

    var {long,lat,radius,type} = req.params;
    console.log({long,lat})
    let url =`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${long},${lat}&radius=500&key=AIzaSyDNaf3lHTN4bQ8zJ57eox_nj5lbwnoecWE`;



    request({
        url: url, //URL to hit
        method: 'get',
        // headers: headers,
        // timeout: 10000,
        // body: JSON.stringify(body)
    }, function(error, result, body) {
        if (error) {
            responses.sendError(res);
            console.log(error)
        } else if (result.statusCode == 500) {
            console.log(result);
        } else {
            body = JSON.parse(body);
            responses.success(res,body);
            console.log(body);
            for (var i = 0; i < body.results.length; i++) {
                console.log('hello')
                // var place_id = body[i].results.id;
                // var place_name = body[i].name;
                // var langitude  = body[i].longitude;
                // var latitude = body[i].latitude;

                console.log(body.results[i].id);

            }
        }
    });
}
/*controller for give details of the places */
