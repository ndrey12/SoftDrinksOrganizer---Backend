const http = require('http');
const port = process.env.PORT || 5000;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

let Secrets = require('./secrets');
let ShoppingList = require('./shoppinglists.js');
let Login = require('./login.js');
let Register = require('./register.js');
let Products = require('./products.js');
let Favorites = require('./favorites.js');
let Users = require('./users.js');

async function Api_Login(req, res)
{
    if(req.method == 'POST')
    {
        const requestBody = [];
        req.on('data', function (data) 
        {
            requestBody.push(data);
        });
        req.on('end', async function() {
            res.writeHead(200, {'Content-Type': 'text/html'})
            const parsedData = Buffer.concat(requestBody).toString();
            let jsonparsedData = JSON.parse(parsedData);
            let username = jsonparsedData.username;
            let password = jsonparsedData.password;
            const status = await Login.checkUserCredentials(username, password);
            if(status >= 1)
            {
                let uid = status;
                let user_token = jwt.sign({userid: uid}, Secrets.jwt_secret)
                var rawJson = {
                    login: true,
                    token: user_token
                }
                res.end(JSON.stringify(rawJson));
            }
            else if(status == 0)
            {
                var rawJson = {
                    login: false,
                    error: 'User not existent'
                }
                res.end(JSON.stringify(rawJson));
            }
            else if(status == -1)
            {
                var rawJson = {
                    login: false,
                    error: 'Wrong password'
                }
                res.end(JSON.stringify(rawJson));
            }
        })
    }
}
async function Api_Register(req, res)
{
    
    if(req.method == 'POST')
    {
        const requestBody = [];
        req.on('data', function (data) 
        {
            requestBody.push(data);
        });
        req.on('end', async function() {
            res.writeHead(200, {'Content-Type': 'text/html'})
            const parsedData = Buffer.concat(requestBody).toString();
            let jsonparsedData = JSON.parse(parsedData);
            let username = jsonparsedData.username;
            let encrypted_password = bcrypt.hashSync(jsonparsedData.password, 10);
            let email = jsonparsedData.email;
            const status = await Register.addUser(username, encrypted_password, email);
            if(status == 1)
            {
                var rawJson = {
                    register: true,
                }
                res.end(JSON.stringify(rawJson));
            }
            else if(status == 2)
            {
                var rawJson = {
                    register: false,
                    error: 'Username already used.'
                }
                res.end(JSON.stringify(rawJson));
            }
            else if(status == 3)
            {
                var rawJson = {
                    register: false,
                    error: 'Email already used.'
                }
                res.end(JSON.stringify(rawJson));
            }
            else
            {
                var rawJson = {
                    register: false,
                    error: 'Database error.'
                }
                res.end(JSON.stringify(rawJson));
            }
        })
    }
}
async function Api_Products(req, res)
{
    res.writeHead(200, {"Content-Type": "application/json"})
    leshoppingListsJson = await Products.getAllProductsJson();

    res.write(JSON.stringify(leshoppingListsJson));
    res.end();
}
async function Api_AddShoppingList(req, res)
{
    if(req.method == 'POST')
    {
        const requestBody = [];
        req.on('data', function (data) 
        {
            requestBody.push(data);
        });
        req.on('end', async function() {
            res.writeHead(200, {'Content-Type': 'text/html'})
            const parsedData = Buffer.concat(requestBody).toString();
            let jsonparsedData = JSON.parse(parsedData);
            let user_jwt = jsonparsedData.token;
            let sl_name = jsonparsedData.listname;
            jwt.verify(user_jwt, Secrets.jwt_secret, async function(err, decoded) {
                if(err)
                {
                    var rawJson = {
                        login: false,
                        error: 'Session lost. Please reconnect.'
                    }
                    res.end(JSON.stringify(rawJson));
                }
                else 
                {
                    let userId = decoded.userid;
                    let createNewShoppingListStatus = await ShoppingList.createNewShoppingList(userId, sl_name);
                    if(createNewShoppingListStatus == 1)
                    {
                        var rawJson = {
                            status: true,
                            message: 'Shopping list successfully created.'
                        }
                        res.end(JSON.stringify(rawJson));
                    } else if(createNewShoppingListStatus == 0) {
                        var rawJson = {
                            status: false,
                            message: 'Database error.'
                        }
                        res.end(JSON.stringify(rawJson));
                    } else if(createNewShoppingListStatus == -1) {
                        var rawJson = {
                            status: false,
                            message: 'User not existent.'
                        }
                        res.end(JSON.stringify(rawJson));
                    } else if(createNewShoppingListStatus == -2) {
                        var rawJson = {
                            status: false,
                            message: 'Shopping list name allready taken.'
                        }
                        res.end(JSON.stringify(rawJson));
                    }
                }
            });
            
        })
    }
}
async function Api_AddProductToShoppingList(req, res)
{
    if(req.method == 'POST')
    {
        const requestBody = [];
        req.on('data', function (data) 
        {
            requestBody.push(data);
        });
        req.on('end', async function() {
            res.writeHead(200, {'Content-Type': 'text/html'})
            const parsedData = Buffer.concat(requestBody).toString();
            let jsonparsedData = JSON.parse(parsedData);
            let user_jwt = jsonparsedData.token;
            let listId = jsonparsedData.listid;
            let productId = jsonparsedData.productid;
            jwt.verify(user_jwt, Secrets.jwt_secret, async function(err, decoded) {
                if(err)
                {
                    var rawJson = {
                        login: false,
                        error: 'Session lost. Please reconnect.'
                    }
                    res.end(JSON.stringify(rawJson));
                }
                else 
                {
                    let userId = decoded.userid;
                    let addProductToShoppingListStatus = await ShoppingList.addProductToShoppingList(userId, listId, productId);
                    if(addProductToShoppingListStatus == 1)
                    {
                        var rawJson = {
                            status: true,
                            message: 'Product successfully added.'
                        }
                        res.end(JSON.stringify(rawJson));
                    } else if(addProductToShoppingListStatus == 0) {
                        var rawJson = {
                            status: false,
                            message: 'Database error.'
                        }
                        res.end(JSON.stringify(rawJson));
                    } else if(addProductToShoppingListStatus == -1) {
                        var rawJson = {
                            status: false,
                            message: 'User not existent.'
                        }
                        res.end(JSON.stringify(rawJson));
                    } else if(addProductToShoppingListStatus == -2) {
                        var rawJson = {
                            status: false,
                            message: 'Shopping list does not exist.'
                        }
                        res.end(JSON.stringify(rawJson));
                    } else if(addProductToShoppingListStatus == -3) {
                        var rawJson = {
                            status: false,
                            message: 'Product does not exist.'
                        }
                        res.end(JSON.stringify(rawJson));
                    } else if(addProductToShoppingListStatus == -4) {
                        var rawJson = {
                            status: false,
                            message: 'User is not the owner of the list.'
                        }
                        res.end(JSON.stringify(rawJson));
                    } else if(addProductToShoppingListStatus == -5) {
                        var rawJson = {
                            status: false,
                            message: 'Product is already in list.'
                        }
                        res.end(JSON.stringify(rawJson));
                    }
                }
            });
            
        })
    }
}
async function Api_RemoveProductFromShoppingList(req, res)
{
    if(req.method == 'POST')
    {
        const requestBody = [];
        req.on('data', function (data) 
        {
            requestBody.push(data);
        });
        req.on('end', async function() {
            res.writeHead(200, {'Content-Type': 'text/html'})
            const parsedData = Buffer.concat(requestBody).toString();
            let jsonparsedData = JSON.parse(parsedData);
            let user_jwt = jsonparsedData.token;
            let listId = jsonparsedData.listid;
            let productId = jsonparsedData.productid;
            jwt.verify(user_jwt, Secrets.jwt_secret, async function(err, decoded) {
                if(err)
                {
                    var rawJson = {
                        login: false,
                        error: 'Session lost. Please reconnect.'
                    }
                    res.end(JSON.stringify(rawJson));
                }
                else 
                {
                    let userId = decoded.userid;
                    let removeProductFromShoppingListStatus = await ShoppingList.removeProductFromShoppingList(userId, listId, productId);
                    if(removeProductFromShoppingListStatus == 1)
                    {
                        var rawJson = {
                            status: true,
                            message: 'Product successfully added.'
                        }
                        res.end(JSON.stringify(rawJson));
                    } else if(removeProductFromShoppingListStatus == 0) {
                        var rawJson = {
                            status: false,
                            message: 'Database error.'
                        }
                        res.end(JSON.stringify(rawJson));
                    } else if(removeProductFromShoppingListStatus == -1) {
                        var rawJson = {
                            status: false,
                            message: 'User not existent.'
                        }
                        res.end(JSON.stringify(rawJson));
                    } else if(removeProductFromShoppingListStatus == -2) {
                        var rawJson = {
                            status: false,
                            message: 'Shopping list does not exist.'
                        }
                        res.end(JSON.stringify(rawJson));
                    } else if(removeProductFromShoppingListStatus == -3) {
                        var rawJson = {
                            status: false,
                            message: 'Product does not exist.'
                        }
                        res.end(JSON.stringify(rawJson));
                    } else if(removeProductFromShoppingListStatus == -4) {
                        var rawJson = {
                            status: false,
                            message: 'User is not the owner of the list.'
                        }
                        res.end(JSON.stringify(rawJson));
                    } else if(removeProductFromShoppingListStatus == -5) {
                        var rawJson = {
                            status: false,
                            message: 'Product is not in the list.'
                        }
                        res.end(JSON.stringify(rawJson));
                    }
                }
            });
            
        })
    }
}
async function Api_AddFavorites(req, res)
{
    if(req.method == 'POST')
    {
        const requestBody = [];
        req.on('data', function (data) 
        {
            requestBody.push(data);
        });
        req.on('end', async function() {
            res.writeHead(200, {'Content-Type': 'text/html'})
            const parsedData = Buffer.concat(requestBody).toString();
            let jsonparsedData = JSON.parse(parsedData);
            let user_jwt = jsonparsedData.token;
            let productId = jsonparsedData.productid;
            jwt.verify(user_jwt, Secrets.jwt_secret, async function(err, decoded) {
                if(err)
                {
                    var rawJson = {
                        login: false,
                        error: 'Session lost. Please reconnect.'
                    }
                    res.end(JSON.stringify(rawJson));
                }
                else 
                {
                    let userId = decoded.userid;
                    let addToFavoriteStatus = await Favorites.addProductToFavorites(userId, productId);
                    if(addToFavoriteStatus == 1)
                    {
                        var rawJson = {
                            status: true,
                            message: 'Product added to favorite.'
                        }
                        res.end(JSON.stringify(rawJson));
                    } else if(addToFavoriteStatus == 0) {
                        var rawJson = {
                            status: false,
                            message: 'Database error.'
                        }
                        res.end(JSON.stringify(rawJson));
                    } else if(addToFavoriteStatus == -1) {
                        var rawJson = {
                            status: false,
                            message: 'User not existent.'
                        }
                        res.end(JSON.stringify(rawJson));
                    } else if(addToFavoriteStatus == -2) {
                        var rawJson = {
                            status: false,
                            message: 'Product not existent.'
                        }
                        res.end(JSON.stringify(rawJson));
                    } else if(addToFavoriteStatus == -3) {
                        var rawJson = {
                            status: false,
                            message: 'Product allready to favorite.'
                        }
                        res.end(JSON.stringify(rawJson));
                    }

                }
            });
            
        })
    }
}
async function Api_RemoveFavorites(req, res)
{
    if(req.method == 'POST')
    {
        const requestBody = [];
        req.on('data', function (data) 
        {
            requestBody.push(data);
        });
        req.on('end', async function() {
            res.writeHead(200, {'Content-Type': 'text/html'})
            const parsedData = Buffer.concat(requestBody).toString();
            let jsonparsedData = JSON.parse(parsedData);
            let user_jwt = jsonparsedData.token;
            let productId = jsonparsedData.productid;
            jwt.verify(user_jwt, Secrets.jwt_secret, async function(err, decoded) {
                if(err)
                {
                    var rawJson = {
                        login: false,
                        error: 'Session lost. Please reconnect.'
                    }
                    res.end(JSON.stringify(rawJson));
                }
                else 
                {
                    let userId = decoded.userid;
                    let removeFromFavoriteStatus = await Favorites.removeProductFromFavorites(userId, productId);
                    if(removeFromFavoriteStatus == 1)
                    {
                        var rawJson = {
                            status: true,
                            message: 'Product removed from favorite.'
                        }
                        res.end(JSON.stringify(rawJson));
                    } else if(removeFromFavoriteStatus == 0) {
                        var rawJson = {
                            status: false,
                            message: 'Database error.'
                        }
                        res.end(JSON.stringify(rawJson));
                    } else if(removeFromFavoriteStatus == -1) {
                        var rawJson = {
                            status: false,
                            message: 'User not existent.'
                        }
                        res.end(JSON.stringify(rawJson));
                    } else if(removeFromFavoriteStatus == -2) {
                        var rawJson = {
                            status: false,
                            message: 'Product not existent.'
                        }
                        res.end(JSON.stringify(rawJson));
                    } else if(removeFromFavoriteStatus == -3) {
                        var rawJson = {
                            status: false,
                            message: 'Product is not favorite.'
                        }
                        res.end(JSON.stringify(rawJson));
                    }

                }
            });
            
        })
    }
}
async function Api_ToggleFavorites(req, res)
{
    if(req.method == 'POST')
    {
        const requestBody = [];
        req.on('data', function (data) 
        {
            requestBody.push(data);
        });
        req.on('end', async function() {
            res.writeHead(200, {'Content-Type': 'text/html'})
            const parsedData = Buffer.concat(requestBody).toString();
            let jsonparsedData = JSON.parse(parsedData);
            let user_jwt = jsonparsedData.token;
            let productId = jsonparsedData.productid;
            jwt.verify(user_jwt, Secrets.jwt_secret, async function(err, decoded) {
                if(err)
                {
                    var rawJson = {
                        login: false,
                        error: 'Session lost. Please reconnect.'
                    }
                    res.end(JSON.stringify(rawJson));
                }
                else 
                {
                    let userId = decoded.userid;
                    let toggleFavoriteProductStatus = await Favorites.toggleFavoriteProduct(userId, productId);
                    if(toggleFavoriteProductStatus == 1)
                    {
                        var rawJson = {
                            status: true,
                            message: 'Product added/removed to favorite.'
                        }
                        res.end(JSON.stringify(rawJson));
                    } else if(toggleFavoriteProductStatus == 0) {
                        var rawJson = {
                            status: false,
                            message: 'Database error.'
                        }
                        res.end(JSON.stringify(rawJson));
                    } else if(toggleFavoriteProductStatus == -1) {
                        var rawJson = {
                            status: false,
                            message: 'User not existent.'
                        }
                        res.end(JSON.stringify(rawJson));
                    } else if(toggleFavoriteProductStatus == -2) {
                        var rawJson = {
                            status: false,
                            message: 'Product not existent.'
                        }
                        res.end(JSON.stringify(rawJson));
                    }
                }
            });
            
        })
    }
}
async function Api_ShoppingLists(req, res)
{
    if(req.method == 'POST')
    {
        const requestBody = [];
        req.on('data', function (data) 
        {
            requestBody.push(data);
        });
        req.on('end', async function() {
            res.writeHead(200, {'Content-Type': 'text/html'})
            const parsedData = Buffer.concat(requestBody).toString();
            let jsonparsedData = JSON.parse(parsedData);
            let user_jwt = jsonparsedData.token;
            jwt.verify(user_jwt, Secrets.jwt_secret, async function(err, decoded) {
                if(err)
                {
                    var rawJson = {
                        login: false,
                        error: 'Session lost. Please reconnect.'
                    }
                    res.end(JSON.stringify(rawJson));
                }
                else 
                {
                    let userId = decoded.userid;
                    let json_ShoppingLists = await ShoppingList.getShoppingListsForUserId(userId);
                    if(json_ShoppingLists == false)
                    {
                        var rawJson = {
                            status: false,
                            message: 'Error'
                        }
                        res.end(JSON.stringify(rawJson));
                    } 
                    else 
                    {
                        res.end(JSON.stringify(json_ShoppingLists));
                    }
                }
            });
            
        })
    }
}
async function Api_Favorites(req, res)
{
    if(req.method == 'POST')
    {
        const requestBody = [];
        req.on('data', function (data) 
        {
            requestBody.push(data);
        });
        req.on('end', async function() {
            res.writeHead(200, {'Content-Type': 'text/html'})
            const parsedData = Buffer.concat(requestBody).toString();
            let jsonparsedData = JSON.parse(parsedData);
            let user_jwt = jsonparsedData.token;
            jwt.verify(user_jwt, Secrets.jwt_secret, async function(err, decoded) {
                if(err)
                {
                    var rawJson = {
                        login: false,
                        error: 'Session lost. Please reconnect.'
                    }
                    res.end(JSON.stringify(rawJson));
                }
                else 
                {
                    let userId = decoded.userid;
                    let json_Favorites = await Favorites.getFavoritesForUser(userId);
                    if(json_Favorites === false)
                    {
                        var rawJson = {
                            status: false,
                            message: 'Error'
                        }
                        res.end(JSON.stringify(rawJson));
                    } 
                    else 
                    {
                        res.end(JSON.stringify(json_Favorites));
                    }
                }
            });
            
        })
    }
}
async function Api_ProductDetails(req, res)
{
    if(req.method == 'POST')
    {
        const requestBody = [];
        req.on('data', function (data) 
        {
            requestBody.push(data);
        });
        req.on('end', async function() {
            res.writeHead(200, {'Content-Type': 'text/html'})
            const parsedData = Buffer.concat(requestBody).toString();
            let jsonparsedData = JSON.parse(parsedData);
            let user_jwt = jsonparsedData.token;
            let productId = jsonparsedData.id;
            jwt.verify(user_jwt, Secrets.jwt_secret, async function(err, decoded) {
                if(err)
                {
                    var rawJson = {
                        login: false,
                        error: 'Session lost. Please reconnect.'
                    }
                    res.end(JSON.stringify(rawJson));
                }
                else 
                {
                    let userId = decoded.userid;
                    let json_ProductsDetails = await Products.getGetProductDetails(userId, productId);
                    if(json_ProductsDetails == false)
                    {
                        var rawJson = {
                            status: false,
                            message: 'Error'
                        }
                        res.end(JSON.stringify(rawJson));
                    } 
                    else if(json_ProductsDetails == -1 || json_ProductsDetails == -2)
                    {
                        var rawJson = {
                            status: false,
                            message: 'Error'
                        }
                        res.end(JSON.stringify(rawJson));
                    }
                    else
                    {
                        res.end(JSON.stringify(json_ProductsDetails));
                    }
                }
            });
            
        })
    }
}
async function Api_UserData(req, res)
{
    if(req.method == 'POST')
    {
        const requestBody = [];
        req.on('data', function (data) 
        {
            requestBody.push(data);
        });
        req.on('end', async function() {
            res.writeHead(200, {'Content-Type': 'text/html'})
            const parsedData = Buffer.concat(requestBody).toString();
            let jsonparsedData = JSON.parse(parsedData);
            let user_jwt = jsonparsedData.token;
            jwt.verify(user_jwt, Secrets.jwt_secret, async function(err, decoded) {
                if(err)
                {
                    var rawJson = {
                        login: false,
                        error: 'Session lost. Please reconnect.'
                    }
                    res.end(JSON.stringify(rawJson));
                }
                else 
                {
                    let userId = decoded.userid;
                    let json_UserData = await Users.getUserData(userId);
                    if(json_UserData === false)
                    {
                        var rawJson = {
                            status: false,
                            message: 'Error'
                        }
                        res.end(JSON.stringify(rawJson));
                    } 
                    else if(json_UserData === -1 )
                    {
                        var rawJson = {
                            status: false,
                            message: 'Error'
                        }
                        res.end(JSON.stringify(rawJson));
                    }
                    else
                    {
                        res.end(JSON.stringify(json_UserData));
                    }
                }
            });
            
        })
    }
}
async function Api_ChangePassword(req, res)
{
    if(req.method == 'POST')
    {
        const requestBody = [];
        req.on('data', function (data) 
        {
            requestBody.push(data);
        });
        req.on('end', async function() {
            res.writeHead(200, {'Content-Type': 'text/html'})
            const parsedData = Buffer.concat(requestBody).toString();
            let jsonparsedData = JSON.parse(parsedData);
            let user_jwt = jsonparsedData.token;
            let new_password = jsonparsedData.new_password;
            let last_password = jsonparsedData.last_password;
            jwt.verify(user_jwt, Secrets.jwt_secret, async function(err, decoded) {
                if(err)
                {
                    var rawJson = {
                        login: false,
                        error: 'Session lost. Please reconnect.'
                    }
                    res.end(JSON.stringify(rawJson));
                }
                else 
                {
                    let userId = decoded.userid;
                    let changePasswordStatus = await Users.changePassword(userId, last_password, new_password);
                    if(changePasswordStatus === false)
                    {
                        var rawJson = {
                            status: false,
                            message: 'Error'
                        }
                        res.end(JSON.stringify(rawJson));
                    } 
                    else if(changePasswordStatus === -1 )
                    {
                        var rawJson = {
                            status: false,
                            message: 'Error'
                        }
                        res.end(JSON.stringify(rawJson));
                    }
                    else
                    {
                        var rawJson = {
                            status: true,
                            message: 'Succes'
                        }
                        res.end(JSON.stringify(rawJson));
                    }
                }
            });
            
        })
    }
}
async function Api_ChangeEmail(req, res)
{
    if(req.method == 'POST')
    {
        const requestBody = [];
        req.on('data', function (data) 
        {
            requestBody.push(data);
        });
        req.on('end', async function() {
            res.writeHead(200, {'Content-Type': 'text/html'})
            const parsedData = Buffer.concat(requestBody).toString();
            let jsonparsedData = JSON.parse(parsedData);
            let user_jwt = jsonparsedData.token;
            let new_email = jsonparsedData.new_email;
            jwt.verify(user_jwt, Secrets.jwt_secret, async function(err, decoded) {
                if(err)
                {
                    var rawJson = {
                        login: false,
                        error: 'Session lost. Please reconnect.'
                    }
                    res.end(JSON.stringify(rawJson));
                }
                else 
                {
                    let userId = decoded.userid;
                    let changeEmailStatus = await Users.changeEmail(userId, new_email);
                    if(changeEmailStatus === false)
                    {
                        var rawJson = {
                            status: false,
                            message: 'Error'
                        }
                        res.end(JSON.stringify(rawJson));
                    } 
                    else if(changeEmailStatus === -1 )
                    {
                        var rawJson = {
                            status: false,
                            message: 'Error'
                        }
                        res.end(JSON.stringify(rawJson));
                    }
                    else
                    {
                        var rawJson = {
                            status: true,
                            message: 'Succes'
                        }
                        res.end(JSON.stringify(rawJson));
                    }
                }
            });
            
        })
    }
}
async function Api_ProductQuerry(req, res)
{
    if(req.method == 'POST')
    {
        const requestBody = [];
        req.on('data', function (data) 
        {
            requestBody.push(data);
        });
        req.on('end', async function() {
            res.writeHead(200, {'Content-Type': 'text/html'})
            const parsedData = Buffer.concat(requestBody).toString();
            let jsonparsedData = JSON.parse(parsedData);
            let user_jwt = jsonparsedData.token;
            let querry = jsonparsedData.querry;
            let orderBy = jsonparsedData.orderBy;
            jwt.verify(user_jwt, Secrets.jwt_secret, async function(err, decoded) {
                if(err)
                {
                    var rawJson = {
                        login: false,
                        error: 'Session lost. Please reconnect.'
                    }
                    res.end(JSON.stringify(rawJson));
                }
                else 
                {
                    let userId = decoded.userid;
                    let json_ProductQuerry = await Products.getProductQuerry(userId, querry, orderBy);
                    if(json_ProductQuerry === false)
                    {
                        var rawJson = {
                            status: false,
                            message: 'Error'
                        }
                        res.end(JSON.stringify(rawJson));
                    } 
                    else 
                    {
                        res.end(JSON.stringify(json_ProductQuerry));
                    }
                }
            });
            
        })
    }
}
http.createServer((req, res) => {
    const url = req.url;

    res.setHeader('Access-Control-Allow-Origin', '*');

    if(url === "/api/login")
    {
        Api_Login(req, res);
    } 
    else if(url == "/api/register") 
    {
        Api_Register(req, res);
    } 
    else if(url == "/api/products") 
    {
        Api_Products(req, res);
    }
    else if(url == "/api/shopping-lists") 
    {
        Api_ShoppingLists(req, res);
    } 
    else if(url == "/api/add-shopping-list") 
    {
        Api_AddShoppingList(req, res);
    }
    else if(url == "/api/add-product-to-shopping-list")
    {
        Api_AddProductToShoppingList(req, res);
    }
    else if(url == "/api/remove-product-from-shopping-list")
    {
        Api_RemoveProductFromShoppingList(req, res);
    }
    else if(url == "/api/add-favorites")
    {
        Api_AddFavorites(req, res);
    }
    else if(url == "/api/remove-favorites")
    {
        Api_RemoveFavorites(req, res);
    }
    else if(url == "/api/toggle-favorites")
    {
        Api_ToggleFavorites(req, res);
    } else if(url == "/api/favorites")
    {
        Api_Favorites(req, res);
    } else if(url == "/api/product-details")
    {
        Api_ProductDetails(req, res);
    }  else if(url == "/api/user-data")
    {
        Api_UserData(req, res);
    } else if(url == "/api/change-password")
    {
        Api_ChangePassword(req, res);
    }  else if(url == "/api/change-email")
    {
        Api_ChangeEmail(req, res);
    } else if(url == "/api/product-querry")
    {
        Api_ProductQuerry(req, res);  
    }
}).listen(port, () => {
    console.log('Server listening on port ' + port);
});