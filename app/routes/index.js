'use strict';

var request = require('request');
var path = process.cwd();
var Place=require('../models/places.js')
var Save=require('../models/save.js')

module.exports = function (app, passport) {

	function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.redirect('/');
		}
	}

	app.route('/')
		.get(function (req, res) {
			var username='undefined';
			if(req.user != undefined){
				username= req.user.local.username || req.user.github.username || req.user.facebook.name;
			}
			
			res.render('index',{user:username});
		});
	
	//----AUTHENTICATION ROUTES-------
	app.route('/login')
		.get(function (req, res) {
			res.sendFile(path + '/public/login.html');
		});
		
	app.route('/localLogin')
		.post(passport.authenticate('local',{failureRedirect:'/login', successRedirect: '/'}));
		
	app.route('/gitLogin')
		.get(passport.authenticate('github'));

	app.route('/auth/github/callback')
		.get(passport.authenticate('github', {
			successRedirect: '/',
			failureRedirect: '/'
		}));
		
	app.route('/fbLogin')
		.get(passport.authenticate('facebook'));
		
	app.route('/fbLogin/callback')
		.get(passport.authenticate('facebook',{
			successRedirect: '/',
			failureRedirect: '/'
		}));

	app.route('/logout')
		.get(function (req, res) {
			req.logout();
			res.redirect('/');
		});
		
	//----ROUTES FOR NIGHTLIFE APP------------
	app.route('/nightlife')
		.get(isLoggedIn,function(req,res){
			res.setHeader('Access-Control-Allow-Origin', '*');
			res.render('nightlife/nightlifeHP',{'api_key': process.env.GOOGLE_MAPS_KEY,'page': 'homepage'})
		})
		
	app.route('/nightlife/putData')
		.get(isLoggedIn,function(req,res){
			var user;
			if(req.user!=undefined){
				user = req.user.local.username || req.user.github.username || req.user.facebook.name;
			}
			res.render('nightlife/newDataForm',{user:user});
		})
		
	app.route('/nightlife/save')
		.post(function(req,res){
			var user;
			if(req.user!=undefined){
				user = req.user.local.username || req.user.github.username || req.user.facebook.name;
			}
			else{
				res.send('You are not logged in!')
				return
			}
			var issave=false;
			Save.find({placeID:req.body.placeID, users:user},function(err,data){
				if(err){
					throw err;
				}
				
				if(data!=[]){
					issave=true;
				}
			})
			if(issave==true){
				res.send("You are already listed!")
				return
			}
			Save.findOneAndUpdate({placeID: req.body.placeId, users:{$ne:user}},{$push:{users:user}}, function(err,data){
				if (data==null){
					var save= new Save()
					save.placeName=req.body.place;
					save.placeID=req.body.placeId;
					save.users.push(user)
					
					save.save(function(err){
						if(err){
							throw err;
						}
					})
					res.send({"numOfPpl":save.numberOfPpl});
				}
				else{
					res.send({"numOfPpl":data.numberOfPpl})
				}
			})
		})
		.get(isLoggedIn,function(req,res){
			var	user = req.user.local.username || req.user.github.username || req.user.facebook.name;
			res.render('nightlife/saves.jade',{user: user})
		})
		
	app.route('/nightlife/addNote')
		.post(function(req,res){
			Save.findOneAndUpdate({placeID:req.body.placeID},{$push: {notes:req.body.note}},function(err,data){
				if(err){
					throw err;
				}
				res.send("saved")
			})
		})
		
	app.route('/nightlife/removeNote')
		.post(function(req,res){
			Save.findOneAndUpdate({placeID:req.body.placeID},{$pull: {notes:req.body.note}},function(err,data){
				if(err){
					throw err;
				}
				res.send("saved")
			})
		})
	
	app.route('/nightlife/saves')
		.get(function(req,res){
			Save.find({},function(err,data){
				if (err){
					throw err;
				}
				res.json(data)
			})
		})
		
	app.route('/nightlife/mysaves')
		.get(function(req,res){
			var user;
			if(req.user!=undefined){
				user = req.user.local.username || req.user.github.username || req.user.facebook.name;
			}
			
			Save.find({users:user},function(err,data){
				if (err){
					throw err;
				}
				res.json(data)
			})
		})
	
	app.route('/nightlife/removesave')
		.post(function(req,res){
			var	user = req.user.local.username || req.user.github.username || req.user.facebook.name;
			var query={placeID:req.body.placeId, users:user}
			if(user=='Akademskig'){
				Save.findOne({placeID:req.body.placeId}, function(err,doc){
				if(err){
					throw err;
				}
				doc.remove()
			})
			}
			Save.update(query,{$pull:{users:user}},function(err,data){
				if(err){
					throw err
				}
			})
			Save.find({'numberOfPpl':{'$lte':0}}, function(err,docs){
				if(err){
					throw err;
				}
				if(docs.length!=0){
					docs.forEach(function(doc){
					doc.remove()
					})
				}
			})
			res.send('Deleted')
		})
	
	app.route('/nightlife/putData/newPlace')
		.post(isLoggedIn,function(req,res){
			console.log(req.body.id)
			var user= req.user.local.username || req.user.github.username || req.user.facebook.name;
			var query=(req.body.id)?{id:req.body.id}:{placeName: req.body.place}
			Place.findOne(query,function(err,data){
				if(err){
					throw err;
				}
				if(data==null){
					var place = new Place()
					place.id= new Date().getTime()
					place.placeName=req.body.place.toLowerCase()
					place.address=req.body.address
					place.cityName=req.body.city
					
					var keywords=req.body.keywords.split(',')
					
					keywords.forEach(function(key){
						var a=key.split("")
						while(a[0]==" "){
							a.shift();
						}
						key=a.join("")
						place.keyword.push(key)
					})
					
					place.addInfo=req.body.addInfo
					place.user=user
					place.save(function(err,data){
						if(err){
							throw err
						}
					})
				}
				else if(req.body.id){
					console.log(data.keyword==req.body.keywords)
					if(data.keyword!=req.body.keywords){
						data.set({"keyword":[]})
						var keywords=req.body.keywords.split(',')
					
						keywords.forEach(function(key){
							var a=key.split("")
							while(a[0]==" "){
							a.shift();
							}
							key=a.join("")
							data.keyword.push(key)
						})
					}
					data.placeName=(data.placeName!=req.body.place)? req.body.place:data.placeName
					data.cityName=(data.cityName!=req.body.city) ? req.body.city:data.cityName
					data.address=(data.address!=req.body.address) ? req.body.address: data.address
					data.addInfo=(data.addInfo != req.body.addInfo) ? req.body.addInfo: data.addInfo
					data.save()
				}
			})
			res.redirect('/nightlife/putData/newPlace')
		})
		.get(function(req,res){
			res.redirect('/nightlife/places')
		})
		
	app.route('/nightlife/places')
		.get(isLoggedIn,function(req,res){
			var user= req.user.local.username || req.user.github.username || req.user.facebook.name;
			res.render('nightlife/places.jade',{user:user})
		})
		
	app.route('/nightlife/allPlaces')
		.get(function(req,res){
			Place.find({},function(err,data){
				if(err){
					throw err
				}
				res.json(data);
			})
		})
		.post(function(req,res){
			var query={cityName:req.body.city, keyword: req.body.keyword}
			
			if(!req.body.city){
				query={keyword: req.body.keyword}
			}
			if(!req.body.keyword){
				query={cityName:req.body.city}
			}
			if(!req.body.city && !req.body.keyword){
				query={}
			}
			
			Place.find(query,function(err,data){
				if(err){
					throw err
				}
				
				res.json(data);
			})
		})
		
	app.route('/nightlife/myPlaces')
		.get(function(req,res){
			var user;
			if(req.user){
				user = req.user.local.username || req.user.github.username || req.user.facebook.name;
			}
			else{
				res.send('You are not logged in!')
				return
			}
			Place.find({user:user},function(err,data){
				if(err){
					throw err
				}
				res.json(data);
			})
		})
		
	app.route('/nightlife/removePlace')
		.post(function(req,res){
			Place.remove({placeName:req.body.placeName},function(err,data){
				if(err){
					throw err
				}
			})
			res.send('Deleted')
		})
	
	app.route('/nightlife/loc/')
		.post(function(req,res){
			var opts= {
	        		url:req.body.url,
	        		headers:{
	        		'Accept-Charset':'utf-8',
	            	'Content-Type': ' charset=utf-8',
	            	'Accept': 'application/json'
	                }};
	                
	            request.get(opts, function(err,resp, body){
	            	res.json(resp.body)
			})        
		})
        
    app.route('/nightlife/details')
    	.post(function(req,res){
    		var detailsUrl=req.body.url;
            	
        	var opts={
            	url: detailsUrl,
            	headers:{
            	'Content-Type': 'application/x-www-form-urlencoded',
            	'Accept': 'application/json'
            }}
            request.get(opts,function(err,resp,body){
            	res.json(JSON.parse(resp.body))
            })
        })
	
	app.route('/nightlife/searchCities')
		.get(isLoggedIn,function(req,res){
			res.render('nightlife/searchCities',{'page': 'cities'})
		})
};
