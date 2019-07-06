const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
// var passport = require('passport');
// var LocalStrategy = require('passport-local').Strategy;

// const config = require('../../config/index');

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
	console.log(req.body);
	console.log('============================================================')
	const { email,password } = req.body;
	console.log(email,password);
	
	if (!email || !password) {
		res.status(404).json({error:true,message:"Fill all the feilds"});
	}


      User.find({email,isActive:true,isDeleted:false }, (err, user) => {
        if (err) {
          res.status(404).json({error:true,message:err.message});
        }
        if (!user || user.length != 1) {
          res.status(404).json({error:true,message:'Invalid email or password'});
        }else{
          	User.comparePassword(password,user[0].password,function (err,isMatch) {
				if (err)  throw err;
				if (isMatch) {
					// CREATE TOKEN WITH JWT
					const token = jwt.sign({ id: user }, 'iuwbgu9bg98whwiv9wg98wghne908hgoin');
					
					const { isAdmin,isDeleted,isActive,email,name,tel,_id,createdAt,updatedAt } = user[0];

					const data = { isAdmin,isDeleted,isActive,email,name,tel,_id,createdAt,updatedAt,token };
					return res.status(200).json({success:true,user:data});
				}else{
					return res.status(404).json({error:true,message:'Invalid email or password'});
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