var mysql = require('mysql2');
const bcrypt = require("bcryptjs");
let Secrets = require('./secrets');
var Promise = require('bluebird');
const { async } = require('q');

const pool = mysql.createPool({
  host: Secrets.host,
  user: Secrets.username,
  password: Secrets.password,
  database: Secrets.username
})

let getPool = function () {
  return pool;
}

query_checkIfUserExistsByUsername = (username) =>{

  let mysql_query = 'SELECT COUNT(*) as accountNumber FROM USERS WHERE `username` = ' + mysql.escape(username);
  return new Promise((resolve, reject)=>{
      pool.query(mysql_query,  (error, results)=>{
          if(error){
              return reject(error);
          }
          var normalObj = Object.assign({}, results[0]);
          if(normalObj["accountNumber"] == 1) return resolve(true);
          return resolve(false);
      });
  });
};
query_checkIfUserExistsByEmail = (email) =>{

  let mysql_query = 'SELECT COUNT(*) as accountNumber FROM USERS WHERE `email` = ' + mysql.escape(email);
  return new Promise((resolve, reject)=>{
      pool.query(mysql_query,  (error, results)=>{
          if(error){
              return reject(error);
          }
          var normalObj = Object.assign({}, results[0]);
          if(normalObj["accountNumber"] == 1) return resolve(true);
          return resolve(false);
      });
  });
};
query_checkIfPaswordIsCorrectForUser = (username, password) =>{

  let mysql_query = 'SELECT *  FROM USERS WHERE `username` = ' + mysql.escape(username);
  return new Promise((resolve, reject)=>{
      pool.query(mysql_query,  (error, results)=>{
          if(error){
              return reject(error);
          }
          var normalObj = Object.assign({}, results[0]);
          var uid = normalObj["id"];
          let encrypted_password = normalObj["password"];
          if(bcrypt.compareSync(password, encrypted_password))
            return resolve(uid);
          return resolve(-1);
      });
  });
};
query_checkIfPaswordIsCorrectForUserId = (userId, password) =>{

    let mysql_query = 'SELECT *  FROM USERS WHERE `id` = ' + mysql.escape(userId);
    return new Promise((resolve, reject)=>{
        pool.query(mysql_query,  (error, results)=>{
            if(error){
                return reject(error);
            }
            var normalObj = Object.assign({}, results[0]);
            let encrypted_password = normalObj["password"];
            if(bcrypt.compareSync(password, encrypted_password))
              return resolve(true);
            return resolve(false);
        });
    });
  };
  query_setPasswordForUserId = (userId, password) =>{

    let mysql_query = 'CALL change_user_password(' + mysql.escape(userId) + ", " + mysql.escape(password) + ")";
    return new Promise((resolve, reject)=>{
        pool.query(mysql_query,  (error, results)=>{
            if(error){
                return reject(error);
            }
              return resolve(true);
        });
    });
  };
  query_setEmailForUserId = (userId, email) =>{

    let mysql_query = 'CALL change_user_email(' + mysql.escape(userId) + ", " + mysql.escape() + ")";
    return new Promise((resolve, reject)=>{
        pool.query(mysql_query,  (error, results)=>{
            if(error){
                return reject(error);
            }
              return resolve(true);
        });
    });
  };
query_addUser = (username, password, email) =>{
  let mysql_query = 'CALL add_user(' + mysql.escape(username) + ', ' + mysql.escape(password) + ', ' + mysql.escape(email) + ')' ;
  return new Promise((resolve, reject)=>{
      pool.query(mysql_query,  (error, results)=>{
          if(error){
              return reject(error);
          }
          return resolve(true);
      });
  });
};
query_getAllProductsIds = () => {
    let mysql_query = 'SELECT `id` as product_id FROM PRODUCTS WHERE 1';
    return new Promise((resolve, reject)=>{
        pool.query(mysql_query,  (error, results)=>{
            if(error){
                return reject(error);
            }
            var normalObj = Object.assign({}, results);
            return resolve(normalObj);
        });
    });
};
query_checkIfProductExistsById = (productId) =>{

  let mysql_query = 'SELECT COUNT(*) as productCounter FROM PRODUCTS WHERE `id` = ' + mysql.escape(productId);
  return new Promise((resolve, reject)=>{
      pool.query(mysql_query,  (error, results)=>{
          if(error){
              return reject(error);
          }
          var normalObj = Object.assign({}, results[0]);
          if(normalObj["productCounter"] == 1) return resolve(true);
          return resolve(false);
      });
  });
};
query_checkIfProductIsAllreadyToFavorite = (userId, productId) =>{

  let mysql_query = 'SELECT COUNT(*) as productCounter FROM FAVORITES WHERE `user_id` = ' + mysql.escape(userId) + ' AND `product_id` = ' + mysql.escape(productId);
  return new Promise((resolve, reject)=>{
      pool.query(mysql_query,  (error, results)=>{
          if(error){
              return reject(error);
          }
          var normalObj = Object.assign({}, results[0]);
          if(normalObj["productCounter"] == 1) return resolve(true);
          return resolve(false);
      });
  });
};
query_checkIfUserExistsById = (userId) =>{

  let mysql_query = 'SELECT COUNT(*) as accountNumber FROM USERS WHERE `id` = ' + mysql.escape(userId);
  return new Promise((resolve, reject)=>{
      pool.query(mysql_query,  (error, results)=>{
          if(error){
              return reject(error);
          }
          var normalObj = Object.assign({}, results[0]);
          if(normalObj["accountNumber"] == 1) return resolve(true);
          return resolve(false);
      });
  });
};
query_checkIfShoppingListsExistsByName = (name) =>{

    let mysql_query = 'SELECT COUNT(*) as slCount FROM SHOPPING_LISTS WHERE `name` = ' + mysql.escape(name);
    return new Promise((resolve, reject)=>{
        pool.query(mysql_query,  (error, results)=>{
            if(error){
                return reject(error);
            }
            var normalObj = Object.assign({}, results[0]);
            if(normalObj["slCount"] == 1) return resolve(true);
            return resolve(false);
        });
    });
};
query_checkIfShoppingListsExistsById = (listId) =>{

    let mysql_query = 'SELECT COUNT(*) as slCount FROM SHOPPING_LISTS WHERE `id` = ' + mysql.escape(listId);
    return new Promise((resolve, reject)=>{
        pool.query(mysql_query,  (error, results)=>{
            if(error){
                return reject(error);
            }
            var normalObj = Object.assign({}, results[0]);
            if(normalObj["slCount"] == 1) return resolve(true);
            return resolve(false);
        });
    });
};
query_checkIfProductIsInList = (listId, productId) =>{

    let mysql_query = 'SELECT COUNT(*) as isInList FROM SHOPPING_LIST_ITEMS WHERE `list_id` = ' + mysql.escape(listId) +' AND ' + ' `product_id` = ' + mysql.escape(productId);
    return new Promise((resolve, reject)=>{
        pool.query(mysql_query,  (error, results)=>{
            if(error){
                return reject(error);
            }
            var normalObj = Object.assign({}, results[0]);
            if(normalObj["isInList"] == 1) return resolve(true);
            return resolve(false);
        });
    });
};
query_addProductToFavorites = (userId, productId) =>{
  let mysql_query = 'CALL add_favorite(' + mysql.escape(userId) + ', ' + mysql.escape(productId) + ')' ;
  return new Promise((resolve, reject)=>{
      pool.query(mysql_query,  (error, results)=>{
          if(error){
              return reject(error);
          }
          return resolve(true);
      });
  });
};
query_removeProductToFavorites = (userId, productId) =>{
    let mysql_query = 'CALL remove_favorite(' + mysql.escape(userId) + ', ' + mysql.escape(productId) + ')' ;
    return new Promise((resolve, reject)=>{
        pool.query(mysql_query,  (error, results)=>{
            if(error){
               return reject(error);
            }
            return resolve(true);
        });
    });
};
query_createNewShoppingList = (userId, name) =>{
    let mysql_query = 'CALL create_shopping_list(' + mysql.escape(userId) + ', ' + mysql.escape(name) + ')' ;
    return new Promise((resolve, reject)=>{
        pool.query(mysql_query,  (error, results)=>{
            if(error){
                return reject(error);
            }
            return resolve(true);
        });
    });
};
query_addProductToShoppingList = (listId, productId) =>{
    let mysql_query = 'CALL add_item_to_shopping_list(' + mysql.escape(listId) + ', ' + mysql.escape(productId) + ')' ;
    return new Promise((resolve, reject)=>{
        pool.query(mysql_query,  (error, results)=>{
            if(error){
                return reject(error);
            }
            return resolve(true);
        });
    });
};
query_removeProductFromShoppingList = (listId, productId) =>{
    let mysql_query = 'CALL delete_item_from_shopping_list(' + mysql.escape(listId) + ', ' + mysql.escape(productId) + ')' ;
    return new Promise((resolve, reject)=>{
        pool.query(mysql_query,  (error, results)=>{
            if(error){
                return reject(error);
            }
            return resolve(true);
        });
    });
};
query_getShoppingListOwnerId = (listId) =>{

    let mysql_query = 'SELECT `owner_id` FROM SHOPPING_LISTS WHERE `id` = ' + mysql.escape(listId);
    return new Promise((resolve, reject)=>{
        pool.query(mysql_query,  (error, results)=>{
            if(error){
                return reject(error);
            }
            var normalObj = Object.assign({}, results[0]);
            var owner_id = normalObj["owner_id"];
            return resolve(owner_id);
        });
    });
};
query_getShoppingListForOwnerId = (userId) =>{

    let mysql_query = 'SELECT `id`, `name` FROM SHOPPING_LISTS WHERE `owner_id` = ' + mysql.escape(userId);
    return new Promise((resolve, reject)=>{
        pool.query(mysql_query,  (error, results)=>{
            if(error){
                return reject(error);
            }
            var normalObj = Object.assign({}, results);
            return resolve(normalObj);
        });
    });
};
query_getProductsFromList = (listId) =>{

    let mysql_query = 'SELECT `product_id` FROM SHOPPING_LIST_ITEMS WHERE `list_id` = ' + mysql.escape(listId);
    return new Promise((resolve, reject)=>{
        pool.query(mysql_query,  (error, results)=>{
            if(error){
                return reject(error);
            }
            var normalObj = Object.assign({}, results);
            return resolve(normalObj);
        });
    });
};
query_getFavoritesProductsIdsForUser = (userId) => {
    let mysql_query = 'SELECT `product_id` FROM FAVORITES WHERE `user_id` = ' + mysql.escape(userId);
    return new Promise((resolve, reject)=>{
        pool.query(mysql_query,  (error, results)=>{
            if(error){
                return reject(error);
            }
            var normalObj = Object.assign({}, results);
            return resolve(normalObj);
        });
    });
};
query_getCountFavoritesProductsForUser = (userId) => {
    let mysql_query = 'SELECT COUNT(*) as cProducts FROM FAVORITES WHERE `user_id` = ' + mysql.escape(userId);
    return new Promise((resolve, reject)=>{
        pool.query(mysql_query,  (error, results)=>{
            if(error){
                return reject(error);
            }
            var normalObj = Object.assign({}, results[0]);
            let cProducts = normalObj["cProducts"];
            return resolve(cProducts);
        });
    });
};
query_getCountShoppingListsForUser = (userId) => {
    let mysql_query = 'SELECT COUNT(*) as cLists FROM SHOPPING_LISTS WHERE `owner_id` = ' + mysql.escape(userId);
    return new Promise((resolve, reject)=>{
        pool.query(mysql_query,  (error, results)=>{
            if(error){
                return reject(error);
            }
            var normalObj = Object.assign({}, results[0]);
            let cLists = normalObj["cLists"];
            return resolve(cLists);
        });
    });
};
query_getTagsForProductId = (productId) => {
    let mysql_query = 'CALL get_tags_for_product(' + mysql.escape(productId) + ')';
    return new Promise((resolve, reject)=>{
        pool.query(mysql_query,  (error, results)=>{
            if(error){
                return reject(error);
            }
            var normalObj = Object.assign({}, results[0]);
            var tags_array = [];
            for(var i = 0; i < Object.keys(normalObj).length; i++)
            {
                tags_array.push(normalObj[i]["tag_text"]);
            }
            return resolve(tags_array);
        });
    });
};
query_getShoppingListsForProductId = (productId) => {
    let mysql_query = 'SELECT `list_id` FROM SHOPPING_LIST_ITEMS WHERE `product_id` = ' + mysql.escape(productId);
    return new Promise((resolve, reject)=>{
        pool.query(mysql_query,  (error, results)=>{
            if(error){
                return reject(error);
            }
            var normalObj = Object.assign({}, results);
            var lists_array = [];
            for(var i = 0; i < Object.keys(normalObj).length; i++)
            {
                lists_array.push(normalObj[i]["list_id"]);
            }
            return resolve(lists_array);
        });
    });
};
query_getInfoForProductId = (productId) => {
    let mysql_query = 'SELECT * FROM PRODUCTS WHERE `id` = ' + mysql.escape(productId);
    return new Promise((resolve, reject)=>{
        pool.query(mysql_query,  (error, results)=>{
            if(error){
                return reject(error);
            }
            var normalObj = Object.assign({}, results[0]);
            return resolve(normalObj);
        });
    });
};
query_getFavoritesCounterForProductId = (productId) =>{

    let mysql_query = 'SELECT COUNT(*) as productCounter FROM FAVORITES WHERE `product_id` = ' + mysql.escape(productId);
    return new Promise((resolve, reject)=>{
        pool.query(mysql_query,  (error, results)=>{
            if(error){
                return reject(error);
            }
            var normalObj = Object.assign({}, results[0]);
            let cnt = normalObj["productCounter"];
            return resolve(cnt);
        });
    });
};
query_getUserDataById = (userId) =>{

    let mysql_query = 'SELECT `email`, `username`  FROM USERS WHERE `id` = ' + mysql.escape(userId);
    return new Promise((resolve, reject)=>{
        pool.query(mysql_query,  (error, results)=>{
            if(error){
                return reject(error);
            }
            var normalObj = Object.assign({}, results[0]);
            return resolve(normalObj);
        });
    });
};
module.exports.getPool = getPool;
module.exports.checkIfUserExistsByUsername = query_checkIfUserExistsByUsername;
module.exports.checkIfUserExistsByEmail = query_checkIfUserExistsByEmail;
module.exports.checkIfUserExistsById = query_checkIfUserExistsById;
module.exports.checkIfProductExistsById = query_checkIfProductExistsById;
module.exports.checkIfPaswordIsCorrectForUser = query_checkIfPaswordIsCorrectForUser;
module.exports.checkIfPaswordIsCorrectForUserId = query_checkIfPaswordIsCorrectForUserId;
module.exports.checkIfProductIsAllreadyToFavorite = query_checkIfProductIsAllreadyToFavorite;
module.exports.checkIfShoppingListsExistsByName = query_checkIfShoppingListsExistsByName;
module.exports.checkIfShoppingListsExistsById = query_checkIfShoppingListsExistsById;
module.exports.checkIfProductIsInList = query_checkIfProductIsInList;
module.exports.addProductToFavorites = query_addProductToFavorites;
module.exports.removeProductFromFavorites = query_removeProductToFavorites;
module.exports.createNewShoppingList = query_createNewShoppingList;
module.exports.addProductToShoppingList = query_addProductToShoppingList;
module.exports.removeProductFromShoppingList = query_removeProductFromShoppingList;
module.exports.getShoppingListOwnerId = query_getShoppingListOwnerId;
module.exports.getShoppingListForOwnerId = query_getShoppingListForOwnerId;
module.exports.getProductsFromList = query_getProductsFromList;
module.exports.getFavoritesProductsIdsForUser = query_getFavoritesProductsIdsForUser;
module.exports.getTagsForProductId = query_getTagsForProductId;
module.exports.getInfoForProductId = query_getInfoForProductId;
module.exports.getFavoritesCounterForProductId = query_getFavoritesCounterForProductId;
module.exports.getShoppingListsForProductId = query_getShoppingListsForProductId;
module.exports.getUserDataById = query_getUserDataById;
module.exports.getCountFavoritesProductsForUser = query_getCountFavoritesProductsForUser;
module.exports.getCountShoppingListsForUser = query_getCountShoppingListsForUser;
module.exports.setPasswordForUserId = query_setPasswordForUserId;
module.exports.setEmailForUserId = query_setEmailForUserId;
module.exports.getAllProductsIds = query_getAllProductsIds;
module.exports.addUser = query_addUser;


