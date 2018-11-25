var mongoose = require("mongoose");
var User = require("../models/user");
var Position = require("../models/Position")
var Blog = require("../models/LocationBlog");
var positionFacade = require("./positionFacade");
var gju = require("geojson-utils");
var userFacade = require("./userFacade");





async function login(username,pass,lat,lon,dist){
  
   var user =  await userFacade.findByUsername(username);

   if(!user){
     return {msg: "wrong username or password", status: 403}
     }else{
      await positionFacade.updatePosition(user,lon,lat);

let allFriends = await Position.find({loc:{ $near :
         {
           $geometry: { type: "Point",  coordinates: [ lon,lat] },
           $maxDistance: dist
         }
      }
  }
).populate("user", "userName");

allFriends.splice(allFriends[0],1);

let friendsInGame = allFriends.map(pos => { 
  let friend = {};
  friend.username = pos.user.userName;
  friend.lon = pos.loc.coordinates[0];
  friend.lat = pos.loc.coordinates[1];
  return friend;

} )

 
    return friendsInGame;
     }
}



module.exports = {
    login: login
  
  }