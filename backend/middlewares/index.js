const {expressjwt} =require('express-jwt');

module.exports = {

    requireSignIn : expressjwt({
    getToken: (req,res) => req.cookies.token,
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"],
}),

}