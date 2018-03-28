var connection = require('../modules/connection');

exports.checkLoginEmail = function (email, callback) {
	var sql = "SELECT * FROM `registration` WHERE `email`=?";
	connection.query(sql, [email], function(err, result){ 
		if (err) {
			callback(1);
		} else {
			result.length > 0 ? callback(result) : callback(2);
			// if ( result.length > 0 ) { callback(result); } else { callback(2); }
		}
	});
}
exports.checkSignEmail = function (email, callback) {
	var sql = "SELECT * FROM `registration` WHERE `email`=?";
	connection.query(sql, [email], function(err, result){ 
		if (err) {
			callback(1);
		} else {
			result.length > 0 ? callback(result) : callback(2);
			// if ( result.length > 0 ) { callback(result); } else { callback(2); }
		}
	});
}
exports.updateUserData = function(data, condition, callback) {
	var sql = "UPDATE `registration` SET ? WHERE ?";
	connection.query(sql, [data, condition], function(err, result){
		console.log(err);
		err ? callback(0) : callback(1);
	});
}
exports.createUserData = function(data, callback){
	var createsql = "INSERT INTO `registration` (user_id,access_token,name,email, password, device_type, device_token, latitude, longitude,profile_image) values (?)";
	connection.query(createsql,[data],function(err,result){
		if(err){
		console.log("failed");
		callback(0);
		} else{
			console.log("success")
			callback(result);
		}
	})
}
exports.selectUserData = function(user_id ,callback){
	var selectUsersql = "SELECT * from `registration` WHERE user_id=?";
	connection.query(selectUsersql,[user_id],function(err,result){
		if(err){
			callback(0);
		} else{
			console.log("prachi");
			callback(result);
		}
	})
}