var mysql = require('mysql2');
var Promise = require('bluebird');
let Database = require('./database.js');

//return 0 alta eroare
//return 1 daca se poate adauga userul
//return 2 Username deja folosit
//return 3 Email deja folosit
let addUser = async function(username, password, email) {
    try {
        const userExists = await Database.checkIfUserExistsByUsername(username);
        if(userExists == true)
            return 2;
        const emailExists = await Database.checkIfUserExistsByEmail(email);
        if(emailExists == true)
            return 3;
        const addUserStatus = await Database.addUser(username, password, email);
        if(addUserStatus == true)
            return 1;
        return 0;
    } 
    catch(error) {
        console.log(error);
    }
}
module.exports.addUser = addUser;