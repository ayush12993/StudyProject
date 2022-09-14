const express =require("express");

const router = express.Router();

// middleware
const {requireSignIn} = require('../middlewares');

// controllers
const { makeInstructor } =require( "../controllers/instructor");

router.post("/make-instructor", requireSignIn, makeInstructor);

module.exports = router;