"use strict";

// 3rd Party Resources
const bcrypt = require("bcrypt");
const base64 = require("base-64");
const express = require("express");
const authRouter = express.Router();
const { UserModel } = require("../../collection/index.js");

async function basic(req, res, next) {
    try {
			let { authorization } = req.headers;
			if (!authorization) {
				res.status(401).send("Unauthorized");
			} else {
				let authString = authorization.split(" ")[1];
				let decodedHeaders = base64.decode(authString);
				let [username, password] = decodedHeaders.split(":");
				let validUser = await UserModel.authenticateBasic(username, password);
				if (validUser) {
					req.user = validUser;
					next();
				} else {
                res.status(401).send("Unauthorized");
            }
        }
    } catch (e) {
        console.error("error from basic function in auth.js", e.message);
    }
}
// Signup Route -- create a new user
// Two ways to test this route with httpie
// echo '{"username":"john","password":"foo"}' | http post :3000/signup
// http post :3000/signup username=john password=foo
authRouter.post("/signup", async (req, res) => {
    try {
        let {username, password} = req.body;
				let encryptedPassword = await bcrypt.hash(password, 10);
				console.log(UserModel);
				let user = await UserModel.create({
					username,
					password: encryptedPassword
				})
				res.status(200).send(user);
    } catch (e) {
        res.status(403).send("Error Creating User");
    }
});

// Signin Route -- login with username and password
// test with httpie
// http post :3000/signin -a osknyo:superpass
authRouter.post("/signin", basic, async (req, res) => {
    /*
    req.headers.authorization is : "Basic sdkjdsljd="
    To get username and password from this, take the following steps:
      - Turn that string into an array by splitting on ' '
      - Pop off the last value
      - Decode that encoded string so it returns to user:pass
      - Split on ':' to turn it into an array
      - Pull username and password from that array
  */

    let basicHeaderParts = req.headers.authorization.split(" "); // ['Basic', 'sdkjdsljd=']
    let encodedString = basicHeaderParts.pop(); // sdkjdsljd=
    let decodedString = base64.decode(encodedString); // "username:password"
    let [username, password] = decodedString.split(":"); // username, password

    /*
    Now that we finally have username and password, let's see if it's valid
    1. Find the user in the database by username
    2. Compare the plaintext password we now have against the encrypted password in the db
       - bcrypt does this by re-encrypting the plaintext password and comparing THAT
    3. Either we're valid or we throw an error
  */
    try {
        const user = await UserModel.findOne({ where: { username: username } });
        const valid = await bcrypt.compare(password, user.password);
        if (valid) {
            res.status(200).json(user);
        } else {
            throw new Error("Invalid User");
        }
    } catch (error) {
        res.status(403).send("Invalid Login");
    }
});

module.exports = { basic, authRouter };
