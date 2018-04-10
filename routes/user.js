var user = require('../controllers/user');
var multer = require('multer');
var md5 = require('md5');
var path = require('path');

exports.default = function(app) {
	    var storage = multer.diskStorage({
	destination : function(req,file,callback){
        callback(null,'./uploads/user');
	},
	filename : function(req,file,callback){
		var fileUniqueName = md5(Date.now());
        callback(null,fileUniqueName+ path.extname(file.originalname));
    }
});
var upload = multer({storage:storage});

	// Routes for user login
app.route('/user/login').post(user.login);

	// Routes for user login


app.route('/user/create').post(upload.any(),user.create);
app.route('/user/forgetpassword').post(user.forgetpassword);
app.route('/user/passwordUpdate').post(user.passwordUpdate);
app.route('/user/search_nearby_place/:long/:lat').get(user.search_nearby_place);
//app.route('/user/place_details/:place_id/:access_token').get(user.place_details);

	return app;
}
