var mongoose = require("mongoose");
var User = require("../models/user");
var Position = require("../models/Position");


function getAllPositions() {
    return Position.find({}).exec();
  }

async function createNewPosition(userid,longitude,latitude){
    var user = await User.findById({ _id: userid }).exec();
    let coordinates = [longitude,latitude];
    var positionDetail = { user, loc: {coordinates}};
    var pos = new Position(positionDetail);
    return pos.save();
    
}

async function updatePosition(user,lon,lat){

    let updated = Date.now();
    
    let newPosition = { type: "Point",  coordinates: [ lon,lat] }
    let position = await Position.findOneAndUpdate({user: user._id},{loc:newPosition, created:updated},{upsert:true,new:true}).exec();

    return position;

}


module.exports = {
    createNewPosition: createNewPosition,
    getAllPositions: getAllPositions,
    updatePosition: updatePosition
}
