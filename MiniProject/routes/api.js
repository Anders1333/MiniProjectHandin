var express = require('express');
const gju = require('geojson-utils');
var router = express.Router();
var userFacade = require("../facades/userFacade");
var blogFacade = require("../facades/blogFacade");
var loginFacade = require("../facades/loginFacade");
var positionFacade = require("../facades/positionFacade");
var User = require("../models/user");
var LocationBlog = require("../models/LocationBlog");
const mongoose = require("mongoose");



/* GET /api/. */
router.get('/', function (req, res, next) {
  res.render('api', { title: 'Mini Project API' });
});

//USERFACADE

router.get('/findbyusername/:username', async function (req, res, next) {
  let username = req.params.username;
  var allUsers = await userFacade.findByUsername(username);
  res.send(allUsers);
});

//kurt 5bc32e1d4f21431c64bf4914
router.get('/findbyid/:id', async function (req, res, next) {
  let id = req.params.id;
  var user = await userFacade.findById(id);
  res.send(user);
});

router.get('/getallusers', async function (req, res, next) {
  console.log("hits api!")
  var allUsers = await userFacade.getAllUsers();
  res.send(allUsers);
});


router.post('/adduser', async function (req, res, next) {
  let firstName = req.body.firstName;
  let lastName = req.body.lastName;
  let userName = req.body.userName;
  let password = req.body.password;
  let email = req.body.email;
  let userDetail = { firstName, lastName, userName, password, email };
  let newUser = new User(userDetail);
  
  res.send(newUser.save());
});

//BLOGFACADE

router.get('/locationblogs', async function (req, res, next) {
 
  var blogs = await blogFacade.getAllBlogs();
  res.send(blogs);
    // res.json(blogs);
});


//kurt 5bc32e1d4f21431c64bf4914
router.post('/addlocationblog', async function (req, res, next) {
  let info = req.body.info;
  let longitude = req.body["pos.longtitude"];
  let latitude = req.body["pos.latitude"];
  let author = req.body.author;
  let locationBlogDetails = { info, pos: { longitude, latitude }, author };
  let locationBlog = new LocationBlog(locationBlogDetails);
 
  res.send(locationBlog.save());
});

router.post('/likelocationblog', async function (req, res, next) {
  let blog_id = req.body.blog_id;
  let user_id = req.body.user_id;
  res.send(blogFacade.likeLocationBlog(blog_id, user_id));//Hanne
});


// positionFacade

router.post('/newPosition/:userid',async function (req,res,next){
    let userid = req.params.userid;
    let lon = req.body.longitude;
    let lat = req.body.latitude;
    res.send(positionFacade.createNewPosition(userid,lon,lat));
})

router.get('/allPositions',async function (req,res,next){
    var allPositions = await positionFacade.getAllPositions();
    res.send(allPositions);
})

// LOGINFACADE 

router.post('/login',async function(req,res,next){
  let username = req.body.userName;
  let pass = req.body.password;
  let lat = req.body.latitude;
  let lon = req.body.longitude;
  let dist = req.body.distance;

  // Find / verify User ----------------------------------
  let result = await loginFacade.login(username,pass,lat,lon,dist);
  
  res.send(result);
 
   // ^^ test ...  vv return list
})


module.exports = router;
