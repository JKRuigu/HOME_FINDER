var express = require('express');
var router = express.Router();
// var passport = require('passport');
// var LocalStrategy = require('passport-local').Strategy;

var User = require('../../models/user');

//GET USERS
router.get('/fetch',(req,res)=>{
	User.find({}, (err, users) => {
		if (err) {
			res.status(404).json({error:true,message:"An error occured!"});	
		}else{
			res.status(200).json({success:true,data:users})
		}
	});
});

//Register
router.post('/register',function (req,res) {
	const { name,tel,email,password,password2,isAdmin } = req.body;
	if (!name || !tel || !email || !password2 || !password || password !== password2 || !isAdmin) {
		res.status(404).json({error:true,message:"Fill all the fields"});
	}

	var newUser = new User({
			name,
			tel,
			isAdmin,
			isActive:true,
			isDeleted:false,
			email,
			password
		});

 	User.createUser(newUser,function (err,user) {
 		if (err) throw err; 
 		res.status(201).json({success:true,data:user});
 	});

 	// req.flash('success_msg','You are registered and can now Login');
 	// res.redirect('/users/login');
});

// LOGIN
router.post('/login',(req,res)=>{
	const { username,password } = req.body;
	if (!username || !password) {
		res.status(404).json({error:true,message:"Fill all the feilds"});
	}


      User.find({email:username,isActive:true,isDeleted:false }, (err, user) => {
        if (err) {
          res.status(404).json({error:true,message:err.message});
        }
        if (!user || user.length != 1) {
          // console.log(user)
          res.status(404).json({error:true,message:'Invalid username or password'});
        }else{
          	User.comparePassword(password,user[0].password,function (err,isMatch) {
				if (err)  throw err;
				if (isMatch) {
					return res.status(200).json({success:true,data:user});
				}else{
					return res.status(404).json({error:true,message:'Invalid username or password'});
				}
			});
        }
      });
});

// DELETE
router.delete('/delete/:email',(req,res)=>{
	const{ email } = req.params;
	if (!email) {
		res.status(404).json({error:true,message:"An authorized request"});
	}
	User.find({email},(err,user)=>{
		if (err || user.length !== 1) {
			return res.status(404).json({error:true,message:"Server error or Invalid input"});
		}else{

			User.deleteOne({email},(err,message)=>{
				if (err) {
					return res.status(404).json({error:true,message:"Server error"});
				}
				res.status(201).json({success:true,message});
			});

		}
	});
});

module.exports = router; 