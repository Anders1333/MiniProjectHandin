const mongoose = require("mongoose");
const chai = require("chai");
const expect = require("chai").expect;
const request = require("request");
const dbSetup = require("..//dbSetup");
var User = require("../models/User.js");
var LocationBlog = require("../models/LocationBlog.js");
var Position = require("../models/Position.js");

mongoose.models = {};
mongoose.modelSchemas = {};
mongoose.connection = {};

var userFacade = require("../facades/userFacade");
var blogFacade = require("../facades/blogFacade");
var User = require("../models/User");

var users = [];

var user_id = null;
var blog_id = null;


let connection = null;

describe("Testing the API; REST Endpoints", function () {

    /* Connect to the TEST-DATABASE */
    before(async function () {
        this.timeout(require("../settings").MOCHA_TEST_TIMEOUT);
        await dbSetup(require("../settings").TEST_DB_URI);

        await User.deleteMany({});
        await Position.deleteMany({});
        await LocationBlog.deleteMany({});


        users = await Promise.all([
            new User({ firstName: "Kurt", lastName: "Wonnegut", userName: "kw", password: "test", email: "a@b.dk" }).save(),
            new User({ firstName: "Hanne", lastName: "Wonnegut", userName: "hw", password: "test", email: "b@b.dk" }).save(),
        ])
    })

    after(function () {
        mongoose.connection.close();
    })


    it("Should get all users from endpoint (2)", function (done) {
        const options = {
            url: 'http://localhost:3000/api/getallusers',
            method: 'GET',
            json: true
        };
        request(options, function (error, response, body) {
        
            expect(response.statusCode).to.equal(200);
            expect(body.length).to.be.equal(2);
            expect(body[0].firstName).to.be.equal("Kurt");
            user_id = body[0]._id;
            done();
        })
    })

    it("Should find user by :id from endpoint /findbyid/:id (Kurt)", function (done) {
      
        const options = {
            url: 'http://localhost:3000/api/findbyid/' + user_id,
            method: 'GET',
            json: true
        };
        request(options, function (error, response, body) {
            expect(body.lastName).to.be.equal("Wonnegut");
            expect(body.userName).to.be.equal("kw");
            done();
        })
    })

    it("Should find user by :username from endpoint /findbyusername/:username (hw)", function (done) {
        var user_name = "hw";
        const options = {
            url: "http://localhost:3000/api/findbyusername/" + user_name,
            method: 'GET',
            json: true
        };
        request(options, function (error, response, body) {
            expect(response.body.firstName).to.be.equal("Hanne");
            done();
        })
    })
    it("Should add user Anders to endpoint /adduser/", function (done) {
        const options = {
            url: 'http://localhost:3000/api/adduser/',
            method: 'POST',
            json: true,
            body: {"firstName":"Anders", "lastName":"Christiansen", "userName":"Anderson", "password":"herlev", "email":"bub@bub.dk" }
        };
        request(options, function (error, response, body) {
            expect(response.statusCode).to.equal(200);
            done();
        })
    })
    it("Should add location testPlace to endpoint /addlocationblog/", function (done) {
        const options = {
            url: 'http://localhost:3000/api/addlocationblog/',
            method: 'POST',
            json: true,
            body: { "info":"testPlace", "pos.longtitude":"6", "pos.latitude":"9", "author":user_id}
        };
        request(options, function (error, response, body) {
            expect(response.statusCode).to.equal(200);
            done();
        })
    })
    it("Should GET all locations (1, testplace) from endpoint /locationblogs/", function (done) {
        const options = {
            url: 'http://localhost:3000/api/locationblogs/',
            method: 'GET',
            json: true,
        };
        request(options, function (error, response, body) {
            blog_id = body[0]._id;
            expect(response.statusCode).to.equal(200);
            done();
        })
    })

    it("Should add a like to location testPlace to endpoint /likelocationblog/ by user Kurt", function (done) {
        const options = {
            url: 'http://localhost:3000/api/likelocationblog/',
            method: 'POST',
            json: true,
            body: { "blog_id":blog_id, "user_id":user_id}
        };
        request(options, function (error, response, body) {
            expect(response.statusCode).to.equal(200);
            done();
        })
    })



})


