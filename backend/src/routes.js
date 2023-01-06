const express = require("express");
const routes = express();
const {
    verifyRegisterData,
    verifyLoginData,
    verifyLogin,
} = require("./middlewares/mdUser.js");
const { registerUser, userLogin } = require("./controllers/user.js");
const { editUser } = require("./controllers/loggedUser");

routes.post("/user", verifyRegisterData, registerUser);
routes.post("/login", verifyLoginData, userLogin);

routes.use(verifyLogin);

routes.put("/user/:id", editUser);

module.exports = routes;
