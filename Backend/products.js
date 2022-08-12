var mysql = require('mysql2');
var Promise = require('bluebird');
let Database = require('./database.js');

let getGetProductDetails = async function(userId, productId) {
    try {
        const userExists = await Database.checkIfUserExistsById(userId);
        if(userExists == false) return -1;
        const productExists = await Database.checkIfProductExistsById(productId);
        if(productExists == false) return -2;
        var productDetails = {};
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
        return favoriteObject;
    }
    catch(error) {
        console.log(error);
    }
}
let getProductQuerry = async function(userId, querry, orderBy) {
    try {
        const userExists = await Database.checkIfUserExistsById(userId);
        if(userExists == false) return -1;
        let products_ids = await Database.getAllProductsIds();
        var productArray = [];
        for(var i = 0; i < Object.keys(products_ids).length; i++)
        {
            
            productId = products_ids[i]["product_id"];
            let productInfo = await Database.getInfoForProductId(productId);
            let productTags = await Database.getTagsForProductId(productId);
            let productFavCount = await Database.getFavoritesCounterForProductId(productId);
            let productIsFav = await Database.checkIfProductIsAllreadyToFavorite(userId, productId);
            let productLists = await Database.getShoppingListsForProductId(productId);
            var productObject = {};
            productObject["id"] = productInfo["id"];
            productObject["name"] = productInfo["name"];
            productObject["details"] = productInfo["details"];
            productObject["image_url"] = productInfo["image_url"];
            productObject["tags"] = productTags;
            productObject["favoriteCount"] = productFavCount;
            productObject["isFavorite"] = productIsFav;
            productObject["lists"] = productLists;
            productArray.push(productObject);
        }
        console.log(productArray);
        return productArray;
    } catch(error) {
        console.log(error);
    }
}
module.exports.getProductQuerry = getProductQuerry;
module.exports.getGetProductDetails = getGetProductDetails;