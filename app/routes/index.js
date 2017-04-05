'use strict';

var request = require('request');
var path = process.cwd();
var Yelp = require('yelp');

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
			var username;
			if(req.user != undefined){
				username= req.user.local.username || req.user.github.username || req.user.facebook.name || null;
			}
				console.log(req.user)
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
			res.sendFile(path + '/public/nightlife/nightlifeHP.html')
		})
	
	app.route('/nightlife/loc/')
		.post(function(req,res){
			var callUrl;
			console.log(req.body.reqData)
			
			if(req.body.reqData.keyword==null){
				callUrl='https://maps.googleapis.com/maps/api/place/nearbysearch/json?location='+req.body.reqData.location+'&rankby=distance&key='+process.env.GOOGLE_LOC_KEY+'&callback=?';
			}
			else{
				callUrl='https://maps.googleapis.com/maps/api/place/nearbysearch/json?location='+req.body.reqData.location+'&rankby=distance&keyword='+req.body.reqData.keyword+'&key='+process.env.GOOGLE_LOC_KEY+'&callback=?';
			}
		 
			 var opts= {
        		url:callUrl,
        		headers:{
            	'Content-Type': 'application/x-www-form-urlencoded',
            	'Accept': 'application/json'
                }};
                
            request.get(opts, function(err,resp, body){
            	var photosArray=[]
            	var results= JSON.parse(resp.body);
            	//console.log(results)
            	results.results.forEach(function(item,i){
            		//console.log(item)
            		if (item.photos){
            			var ref=item.photos[0].photo_reference;
            			var photosCall='https://maps.googleapis.com/maps/api/place/photo?maxwidth=200&photoreference='+ref+'&key='+process.env.GOOGLE_PHOTOS_KEY;
            			console.log(photosCall)
            			photosArray.push({'index':i, 'link':photosCall})
            		}
            	})
            	//https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=CnRtAAAATLZNl354RwP_9UKbQ_5Psy40texXePv4oAlgP4qNEkdIrkyse7rPXYGd9D_Uj1rVsQdWT4oRz4QrYAJNpFX7rzqqMlZw2h2E2y5IKMUZ7ouD_SlcHxYq1yL4KbKUv3qtWgTK0A6QbGh87GB3sscrHRIQiG2RrmU_jF4tENr9wGS_YxoUSSDrYjWmrNfeEHSGSc3FyhNLlBU&key=YOUR_API_KEY
            	//var photoObj=JSON.parse(photosArray)
            	var respObj={'places': results, 'photos': photosArray}
            	res.json(respObj)
            })
        });
		
	app.route('https://api.yelp.com/oauth2/token/:credentials')
		.post(function(req,res){
			console.log(req)
		 	console.log(res)
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
