"use strict";
var path = process.cwd();
var Poll = require("../models/polls.js");
var User = require("../models/user.js")
module.exports = function(app,passport){
	var status ="";
	function isLoggedIn(req, res, next){       // check log
		if (req.isAuthenticated()){
			status = true;                     // status for poll
			return next();
		}else{
			status = false;
			res.redirect("/");
		}
	}
	app.route("/")
		.get(function(req,res){
			Poll.find({},{topic:1,creatorName:1},function(err,data){
				if (err) {console.log(err);}
				var topics = [], ids = [], crtNames=[];        // send topic array to client
				for(var i=0;i<data.length;i++){
					if (!data[i].topic){continue;}
					topics.push(data[i].topic);
					ids.push(data[i]._id);
					crtNames.push(data[i].creatorName);
				}
				if (!req.user) {res.render("home",{ topics : topics, 
													ids : ids,
													crtNames: crtNames});}	

				else { res.render("home",{
					crtNames : crtNames,
					ids    : ids,
					topics : topics,				               
					name : req.user.twitter.displayName,
					dname : req.user.twitter.username,  
					id   : req.user.twitter.id});
				}				
			});
		});
 
	app.route("/profile")                // display profile
		.get(isLoggedIn,function(req,res){
			var user = req.user.twitter;
			res.render("profile",{
						dname: user.username,
						name : user.displayName,
						id : user.id,
						location : user.location});
		});

	app.route("/new/poll")                // create new poll
		.post(function(req,res){
			var newPoll = new Poll();
			if (!req.body.voterId) {return res.send("Nothing!")}
			newPoll.topic = req.body.topic;
			newPoll.voterId = req.body.voterId;
			newPoll.allVote = req.body.allVote;
			newPoll.creatorId = req.body.creatorId;
			newPoll.creatorName = req.body.creatorName;
			newPoll.save(function(err){
				if (err) {console.log(err);}
			})			
			res.json(req.body);
		});

	app.route("/poll/:id")              // topic link to poll
		.get(function(req,res){
			var id = req.params.id;
			Poll.findOne({_id:id}).lean().exec(function(err,ok){
				if (err) {console.log(err);}
				var nameList = [], countList = [];
				for (var i=0;i<ok.allVote.length;i++){
					nameList.push(ok.allVote[i].optsName);
					countList.push(ok.allVote[i].optsCount);
				}
				if (!status){
					res.render("poll",{
						user : status,
						title : ok.topic,
						optsList: nameList,
						optsCount: countList });
					}
				else{
					res.render("poll",{
						poll_id : ok._id,
						user_id : req.user.twitter.id,
						user : status,
						title : ok.topic,
						optsList: nameList,
						optsCount: countList });
					}
			});
		});

	app.route("/user/vote")         // handle user vote 
		.post(isLoggedIn,function(req,res){
			var find = {"_id":req.body._id,"allVote.optsName":req.body.optsName};		
			var update = {$push:{"voterId":req.body.voterId},$inc:{"allVote.$.optsCount":1}};
			Poll.findOneAndUpdate(find,update)
					.exec(function(err,ok){
						if(err) {console.log(err);}
						res.send(ok);
					});
			});


	app.route("/logout")            // logout
		.get(function(req,res){
			req.logout();
			res.redirect("/");
		});

	app.route("/api/polls/:id")      // poll display 
		.get(function(req,res){
			Poll.findById(req.params.id,function(err,ok){
				if (err) {console.log(err)};
				res.json(ok);
			});
		});

	app.route("/drop/:id")             // user delete poll
		.get(function(req,res){
			Poll.findByIdAndRemove(req.params.id,function(err,ok){
				if (err) {console.log(err)};
				console.log("Poll have been dropped!");
				res.redirect("/profile");
			})
		})

	app.route("/api/polls")           // all polls info send
		.get(function(req,res){
			Poll.find({},function(err,ok){
				if (err) {console.log(err)};
				res.json(ok);
			});
		});

	app.route("/api/users")           // all users info send
		.get(isLoggedIn,function(req,res){
			User.find({},function(err,ok){
				if (err) {console.log(err)};
				res.json(ok);
			});
		});

	app.route('/auth/twitter')         // authentication window
		.get(passport.authenticate('twitter'));

	app.route('/auth/twitter/callback') // authentication result
		.get(passport.authenticate('twitter', {
			successRedirect: '/',
			failureRedirect: '/auth/twitter'
		}));
}



