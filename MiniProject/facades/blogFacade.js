var LocationBlog = require("../models/LocationBlog");

function addLocationBlog(info, author, longitude, latitude) {
    var LocationBlogDetail = { info, pos: { longitude, latitude }, author };
    var blog = new LocationBlog(LocationBlogDetail);
    return blog.save();
}

// function likeLocationBlog(locationBlog, user) {
//     locationBlog.likedBy = user;
//     return locationBlog;
// }

async function likeLocationBlog(id, user_id) {
    var blog = await LocationBlog.findById({ _id: id }).exec();
    blog.likedBy.push(user_id);
    return blog.save();
}

function findById(id) {
    return LocationBlog.findById({ _id: id }).exec();
}

function getAllBlogs() {
    return LocationBlog.find({}).exec();
}

module.exports = {
    addLocationBlog: addLocationBlog,
    likeLocationBlog: likeLocationBlog,
    findById: findById,
    getAllBlogs: getAllBlogs
}