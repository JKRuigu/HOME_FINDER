var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');



//User Schema
var UserSchema = mongoose.Schema({
	name:{
		type:String,
		index:true
	},
	password:{
		type:String,
		required:true
	},
	isAdmin:{
		type:Boolean,
		required:true,
		default:false
	},
	isActive:{
		type:Boolean,
		required:true,
		default:true
	},
	isDeleted:{
		type:Boolean,
		required:true,
		default:false
	},
	email:{
		unique:true,
		type:String,
		required:true
	},
	tel:{
		type:String,
		required:true
	}
},{
	timestamps:true
});

//Expor module
var User = module.exports = mongoose.model('User',UserSchema);

module.exports.createUser = function (newUser,callback) {
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newUser.password, salt, function(err, hash) {
	        newUser.password = hash;
	        newUser.save(callback); 
    	});
	});
}

// module.exports.getUserByUsername = function (email,callback) {
// 	var query = {email: email};
// 	User.findOne(query,callback);
// }
//mongodb functions
module.exports.getUserById = function (id,callback) {
	User.findById(id,callback);
}

module.exports.comparePassword = function (candidatePassword,hash,callback) {
	bcrypt.compare(candidatePassword, hash, function (err,isMatch) {
		if (err) throw err;
		callback(null, isMatch);
	});
}