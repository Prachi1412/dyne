var commfunc = require('../modules/commonFunction');
var responses = require('../modules/responses');
var UserModal = require('../modals/user');
var md5 = require("md5");

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