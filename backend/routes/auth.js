const express=require('express');
const {requireSignIn} = require('../middlewares');
const router = express.Router();
const {register,login,logout,currentUser,resetPassword,forgotPassword} = require("../controllers/authcontroller");
router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/current-user",requireSignIn, currentUser);
router.post("/forgot-password",forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;