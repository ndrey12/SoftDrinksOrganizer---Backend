var mysql = require('mysql2');
var Promise = require('bluebird');
let Database = require('./database.js');

//return 1 ok
//return 0 db error
//return -1 user not existent
//return -2 product not existent
//return -3 product allready to favorite
let addProductToFavorites = async function(userId, productId)
{
    try {
        const userExists = await Database.checkIfUserExistsById(userId);
        if(userExists == false) return -1;

        const productExists = await Database.checkIfProductExistsById(productId);
        if(productExists == false) return -2;

        const productAllreadyFavorite = await Database.checkIfProductIsAllreadyToFavorite(userId, productId);
        if(productAllreadyFavorite == true) return -3;
        
        const statusDB = await Database.addProductToFavorites(userId, productId);
        if(statusDB == true)
            return 1;
        return 0;
    }
    catch(error) {
        console.log(error);
    }
}
//return 1 ok
//return 0 db error
//return -1 user not existent
//return -2 product not existent
//return -3 product is not favorite
let removeProductToFavorites = async function(userId, productId)
{
    try {
        const userExists = await Database.checkIfUserExistsById(userId);
        if(userExists == false) return -1;

        const productExists = await Database.checkIfProductExistsById(productId);
        if(productExists == false) return -2;

        const productAllreadyFavorite = await Database.checkIfProductIsAllreadyToFavorite(userId, productId);
        if(productAllreadyFavorite == false) return -3;
        
        const statusDB = await Database.removeProductFromFavorites(userId, productId);
        if(statusDB == true)
            return 1;
        return 0;
    }
    catch(error) {
        console.log(error);
    }
}
///return 1 ok
///return 0 db_error
///return -1 user does not exist
///return -2 product does not exist
let toggleFavoriteProduct = async function(userId, productId)
{
    try {
        const userExists = await Database.checkIfUserExistsById(userId);
        if(userExists == false) return -1;

        const productExists = await Database.checkIfProductExistsById(productId);
        if(productExists == false) return -2;

        const productAllreadyFavorite = await Database.checkIfProductIsAllreadyToFavorite(userId, productId);
        if(productAllreadyFavorite == true)
        {
            const statusDB = await Database.removeProductFromFavorites(userId, productId);
            if(statusDB == true)
                return 1;   
        }
        else
        {
            const statusDB = await Database.addProductToFavorites(userId, productId);
            if(statusDB == true)
                return 1;
        }
        return 0;
    }
    catch(error) {
        console.log(error);
    }
}
let getFavoritesForUser = async function(userId)
{
    try {
        const userExists = await Database.checkIfUserExistsById(userId);
        if(userExists == false) return -1;
        let favorites_products = await Database.getFavoritesProductsIdsForUser(userId);
        var favoriteArray = [];
        for(var i = 0; i < Object.keys(favorites_products).length; i++)
        {
            
            productId = favorites_products[i]["product_id"];
            let productInfo = await Database.getInfoForProductId(productId);
            let productTags = await Database.getTagsForProductId(productId);
            let productFavCount = await Database.getFavoritesCounterForProductId(productId);
            let productIsFav = await Database.checkIfProductIsAllreadyToFavorite(userId, productId);
            let productLists = await Database.getShoppingListsForProductId(productId);
            var favoriteObject = {};
            favoriteObject["id"] = productInfo["id"];
            favoriteObject["name"] = productInfo["name"];
            favoriteObject["details"] = productInfo["details"];
            favoriteObject["image_url"] = productInfo["image_url"];
            favoriteObject["tags"] = productTags;
            favoriteObject["favoriteCount"] = productFavCount;
            favoriteObject["isFavorite"] = productIsFav;
            favoriteObject["lists"] = productLists;
            favoriteArray.push(favoriteObject);
        }
        return favoriteArray;
    } catch(error) {
        console.log(error);
    }
}
getFavoritesForUser(1);
module.exports.getFavoritesForUser = getFavoritesForUser;
module.exports.addProductToFavorites = addProductToFavorites;
module.exports.removeProductToFavorites = removeProductToFavorites;
module.exports.toggleFavoriteProduct = toggleFavoriteProduct;