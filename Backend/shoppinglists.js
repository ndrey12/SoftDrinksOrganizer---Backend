var mysql = require('mysql2');
var Promise = require('bluebird');
let Database = require('./database.js');

///return 1 ok
///return 0 db error
///return -1 user not existent
///return -2 shopping list allready existent with 'name' name
let createNewShoppingList = async function (userId, name)
{
    try {
        const userExists = await Database.checkIfUserExistsById(userId);
        if(userExists == false) return -1;
        const slAllreadyExistent = await Database.checkIfShoppingListsExistsByName(name);
        if(slAllreadyExistent == true) return -2;
        const slCreateStatus = await Database.createNewShoppingList(userId, name);
        if(slCreateStatus == true) return 1;
        return 0;
    }
    catch(error) {
        console.log(error);
    }
}
///return 1 ok
///return 0 db error
///return -1 user not existent
///return -2 shopping list doesn;t exist
///return -3 product doesn't exist
///return -4 user isn;t the owner of the list
///return -5 product is allready in list
let addProductToShoppingList = async function(userId, listId, productId)
{
    try {
        const userExists = await Database.checkIfUserExistsById(userId);
        if(userExists == false) return -1;
        const listExists = await Database.checkIfShoppingListsExistsById(listId);
        if(listExists == false) return -2;
        const productExists = await Database.checkIfProductExistsById(productId);
        if(productExists == false) return -3;
        const listOwner = await Database.getShoppingListOwnerId(listId);
        if(listOwner != userId) return -4;
        const productInList = await Database.checkIfProductIsInList(listId, productId);
        if(productInList == true) return -5;
        const addProductStatus = await Database.addProductToShoppingList(listId, productId);
        if(addProductStatus == true) return 1;
        return 0;
    }
    catch(error) {
        console.log(error);
    }
}
///return 1 ok
///return 0 db error
///return -1 user not existent
///return -2 shopping list doesn;t exist
///return -3 product doesn't exist
///return -4 user isn;t the owner of the list
///return -5 product isn't in list
let removeProductFromShoppingList = async function(userId, listId, productId)
{
    try {
        const userExists = await Database.checkIfUserExistsById(userId);
        if(userExists == false) return -1;
        const listExists = await Database.checkIfShoppingListsExistsById(listId);
        if(listExists == false) return -2;
        const productExists = await Database.checkIfProductExistsById(productId);
        if(productExists == false) return -3;
        const listOwner = await Database.getShoppingListOwnerId(listId);
        if(listOwner != userId) return -4;
        const productInList = await Database.checkIfProductIsInList(listId, productId);
        if(productInList == false) return -5;
        const removeProductStatus = await Database.removeProductFromShoppingList(listId, productId);
        if(removeProductStatus == true) return 1;
        return 0;
    }
    catch(error) {
        console.log(error);
    }
}
///return -1 user does not exist
let getShoppingListsForUserId = async function(userid)
{
    try {
        const userExists = await Database.checkIfUserExistsById(userid);
        if(userExists == false) return -1;
        let shop_litts = await Database.getShoppingListForOwnerId(userid);
        for(var i = 0; i < Object.keys(shop_litts).length; i++)
        {
            let listId = shop_litts[i]["id"];
            let products = await Database.getProductsFromList(listId);
            var array = [];
            for(var j = 0; j < Object.keys(products).length; j++)
            {
                array.push(products[j]["product_id"]);
            }
            shop_litts[i]["product_ids"] = array;
        }
        return shop_litts;
        
    } catch(error) {
        console.log(error);
    }
}
module.exports.createNewShoppingList = createNewShoppingList;
module.exports.addProductToShoppingList = addProductToShoppingList;
module.exports.removeProductFromShoppingList = removeProductFromShoppingList;
module.exports.getShoppingListsForUserId = getShoppingListsForUserId;