var mysql = require('mysql2');
var Promise = require('bluebird');
let Database = require('./database.js');
const bcrypt = require("bcryptjs");

let getUserData = async function(userId) {
    try {
        const userExists = await Database.checkIfUserExistsById(userId);
        if(userExists == false) return -1;
        var userdata = {};

        let basicdata = await Database.getUserDataById(userId);
        let favCount = await Database.getCountFavoritesProductsForUser(userId);
        let listCount = await Database.getCountShoppingListsForUser(userId);
        
        userdata["email"] = basicdata["email"];
        userdata["username"] = basicdata["username"];
        userdata["favCount"] = favCount;
        userdata["listCount"] = listCount;

        return userdata;
    }
    catch(error) {
        console.log(error);
    }
}
let changePassword = async function (userId, last_password, new_password)
{
    try {
        const userExists = await Database.checkIfUserExistsById(userId);
        if(userExists == false) return -1;
        const correctPassword = await Database.checkIfPaswordIsCorrectForUserId(userId, last_password);
        if(correctPassword === true) {
            let encrypted_new_password = bcrypt.hashSync(new_password, 10);
            const changePasswordStatus = await Database.setPasswordForUserId(userId, encrypted_new_password);
            if(changePasswordStatus == 1)
                return 1;
            return 0;
        }
        return -1;
    } catch(error) {
        console.log(error)
    }
}
let changeEmail = async function (userId, new_email)
{
    try {
        const userExists = await Database.checkIfUserExistsById(userId);
        if(userExists == false) return -1;
        const changeEmailStatus = await Database.setEmailForUserId(userId, new_email);
        if(changeEmailStatus == 1)
            return 1;
        return 0;
    } catch(error) {
        console.log(error)
    }
}
module.exports.getUserData = getUserData;
module.exports.changePassword = changePassword;
module.exports.changeEmail = changeEmail;