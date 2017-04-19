'use strict';

var request = require('request');
var path = process.cwd();
var Yelp = require('yelp');
var Place=require('../models/places.js')
var Going=require('../models/going.js')
//var UserPLaces=
module.exports = function (app, passport) {

	function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.redirect('/login');
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
			res.redirect('/login');
		});
		
	//----ROUTE FOR NIGHTLIFE APP------------
	app.route('/nightlife')
		.get(function(req,res){
			res.setHeader('Access-Control-Allow-Origin', '*');
			res.render('nightlife/nightlifeHP',{'api_key': process.env.GOOGLE_MAPS_KEY})
		})
		
	app.route('/nightlife/putData')
		.get(function(req,res){
			res.sendFile(path + '/public/nightlife/newDataForm.html');
		})
		
	app.route('/nightlife/going')
		.post(function(req,res){
			console.log(req.body)
			var user;
			if(req.user!=undefined){
				user = req.user.local.username || req.user.github.username || req.user.facebook.name;
			}
			console.log(user)
			Going.findOneAndUpdate({placeID: req.body.placeId},{'$inc':{'numberOfPpl':1},$push:{users:user}}, function(err,data){
				console.log(data)
				if (data==null){
					var going= new Going()
					going.placeName=req.body.place;
					going.placeID=req.body.placeId;
					going.numberOfPpl=1;
					going.users.push(user)
					
					going.save(function(err){
						if(err){
							throw err;
						}
					})
					res.send({"numOfPpl":going.numberOfPpl});
				}
				else{
					res.send({"numOfPpl":data.numberOfPpl})
				}
			})
		})
		.get(function(req,res){
			res.sendFile(path + '/public/nightlife/goings.html')
		})
	
	app.route('/nightlife/goings')
		.get(function(req,res){
			Going.find({},function(err,data){
				if (err){
					throw err;
				}
				res.json(data)
			})
		})
	app.route('/nightlife/myGoings')
		.get(function(req,res){
			var user;
			if(req.user!=undefined){
				user = req.user.local.username || req.user.github.username || req.user.facebook.name;
			}
			
			Going.find({users:user},function(err,data){
				if (err){
					throw err;
				}
				res.json(data)
			})
		})
	
	app.route('/nightlife/removeGoing')
		.post(function(req,res){
			var user;
			if(req.user!=undefined){
				user = req.user.local.username || req.user.github.username || req.user.facebook.name;
			}
			console.log(user)
				console.log(req.body)
			Going.update({placeID:req.body.placeId},{$pull:{users:user}},function(err,data){
				if(err){
					throw err
				}
			})
			res.send('Deleted')
		})
	
	app.route('/nightlife/putData/newPlace')
		.post(function(req,res){
			console.log(req.body.address)
		})
	
	/*app.route('/nightlife/loc/')
		.post(function(req,res){
			var callUrl;
			console.log(req.body.reqData.cityName)
			var cityName=req.body.reqData.cityName;
			var city=req.body.reqData.city;
			var keyword=req.body.reqData.keyword;
			console.log(keyword)
			var cityId=req.body.reqData.cityId;
			var coords=req.body.reqData.location.split(',')
			var lat=Number(coords[0])
			var long=Number(coords[1])
			console.log(req.body.reqData)
			if(req.body.reqData.keyword==null){
				callUrl='https://maps.googleapis.com/maps/api/place/nearbysearch/json?location='+req.body.reqData.location+'&rankby=distance&key='+process.env.GOOGLE_LOC_KEY+'&callback=?';
			}
			else{
				callUrl='https://maps.googleapis.com/maps/api/place/nearbysearch/json?location='+req.body.reqData.location+'&rankby=distance&keyword='+req.body.reqData.keyword+'&key='+process.env.GOOGLE_LOC_KEY+'&callback=?';
			}
		 console.log(callUrl)
			 var opts= {
        		url:callUrl,
        		headers:{
        		'Accept-Charset':'utf-8',
            	'Content-Type': ' charset=utf-8',
            	'Accept': 'application/json'
                }};
                
            request.get(opts, function(err,resp, body){
            	
            	var photosArray=[]
            	console.log(resp.body)
            	var results= JSON.parse(resp.body);
            	if (results.results==[]){
            		res.send("No data found");
            		return
            	}
            	results.results.forEach(function(item,i){
            		Place.findOneAndUpdate({'placeId': item.place_id, 'keyword':{'$ne': keyword}},{$push:{keyword:keyword}},function(err,data){
            			if(err){
            				throw err;
            			}
            			console.log(data)
            			
            			if(data==null){
            				var newPlace=new Place();
	            			newPlace.id=new Date().getTime();
	            			newPlace.placeId=item.place_id;
	            			newPlace.city=city;
	            			newPlace.cityID=cityId;
	            			newPlace.cityName=cityName;
		            		newPlace.coordinates.lat=item.geometry.location.lat;
		            		newPlace.coordinates.long=item.geometry.location.long;
		            		newPlace.address=item.vicinity;
		            		newPlace.placeName=item.name;
		            		newPlace.keyword.push(keyword)
		            		
		            		if(item.photos){
		            			newPlace.attrbutions=item.photos[0].html_attributions
		            			newPlace.photoRef='https://maps.googleapis.com/maps/api/place/photo?maxwidth=200&photoreference='+item.photos[0].photo_reference+'&key='+process.env.GOOGLE_PHOTOS_KEY;
		            		}
		            		newPlace.save(function(err){
		    	                if(err){
		    	                    throw err;
		    	                }
		    	            });
            		   }
            		})
            		
            		//console.log(item)
            	if (item.photos){
            		var ref=item.photos[0].photo_reference;
            		var photosCall='https://maps.googleapis.com/maps/api/place/photo?maxwidth=200&photoreference='+ref+'&key='+process.env.GOOGLE_PHOTOS_KEY;
            		photosArray.push({'index':i, 'link':photosCall})
            	}
			})	
			var respObj={'places': results, 'photos': photosArray}
			console.log(respObj)
            res.json(respObj)
        })
		})        
    */
        
    app.route('/dbSearch')
    	.post(function(req,res){
    		console.log(req.body.city)
    		if(!req.body.city){
    			var error="Think of a city"
    			res.send(error)
    			return
    		}
    		var query= (req.body.city.indexOf(',')==-1)? {'cityName': req.body.city}:{'city':req.body.city}
    		if(req.body.keyword){
    			query.keyword=req.body.keyword
    		}
    		console.log(query)
    		Place.find(query, function(err,data){
    			if(err){
    				throw err;
    			}
    			res.send(data)
    		})
    	})
        
    app.route('/nightlife/loc/details/:pid')
    	.get(function(req,res){
    		    var detailsUrl='https://maps.googleapis.com/maps/api/place/details/json?placeid='+req.params.pid+'&key='+process.env.GOOGLE_DETAILS+'&callback=?';
            	console.log(detailsUrl)
            	var opts={
            		url: detailsUrl,
            		headers:{
            		'Content-Type': 'application/x-www-form-urlencoded',
            		'Accept': 'application/json'
                }}
            	request.get(opts,function(data){
            		res.send(data)
            	
            	})
            })
    		
    
		
	app.route('https://api.yelp.com/oauth2/token/:credentials')
		.post(function(req,res){
		 })
	

	app.route('/profile')
		.get(isLoggedIn, function (req, res) {
			res.sendFile(path + '/public/profile.html');
		});
		
	app.route('/api/:id')
		.get(isLoggedIn, function (req, res) {
			res.json(req.user.github);
		});

};
