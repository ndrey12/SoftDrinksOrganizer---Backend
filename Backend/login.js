var mysql = require('mysql2');
var Promise = require('bluebird');
let Database = require('./database.js');


//return 0 daca userul nu exista
//return 1 daca parola este ok
//return -1 daca parola nu este ok 
let checkUserCredentials = async function(username, password) {
    try {
        const userExists = await Database.checkIfUserExistsByUsername(username);
        if(userExists == false) return 0;
        const userId = await Database.checkIfPaswordIsCorrectForUser(username, password);
        if(userId >= 1) return userId;
        return -1;
    }
    catch(error) {
        console.log(error);
    }
}
module.exports.checkUserCredentials = checkUserCredentials;