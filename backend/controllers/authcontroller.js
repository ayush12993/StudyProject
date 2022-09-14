const User = require('../models/user');
const jwt = require('jsonwebtoken');
const {hashPassword,comparePassword} = require('../utils/authentication');
const AWS = require('aws-sdk');
const {nanoid} = require('nanoid');
const awsConfig = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
    apiVersion: process.env.AWS_API_VERSION,
};

const SES = new AWS.SES(awsConfig);

module.exports = {
    register : async (req, res) => {
       try {
           const {name,email,password} = req.body;
           if (!name )return res.status(400).send("Name is required");
           if (!password || password.length<6)return res.status(400).
           send("Password is required and should be 6 characters long");
           let userExist = await User.findOne({email}).exec();
           if (userExist) return res.status(400).send("Email already taken!");

           const hashedPassword = await hashPassword(password);
           const user =  new User({
               name,
               email,
               password: hashedPassword,
           });
           await user.save();
           console.log("saved user", user);
           return res.json({ok: true, message: user});
       }
       catch(err) {
           console.log(err);
           return res.status(400).send('Try again ')
       }
    },
    login : async (req, res) => {
        try {
          const {email, password} = req.body;
          const user = await User.findOne({email}).exec();
            if (!user) return res.status(400).send("Email not found");
          const match = await comparePassword(password,user.password);
            if (!match) return res.status(400).send("Wrong password");
          const  token = jwt.sign({_id:user._id}, process.env.JWT_SECRET,{expiresIn:"7d"});
          user.password = undefined;
          res.cookie("token", token,{
              httpOnly: true,
          });
          res.json({user:user});
        }
        catch(err) {
            console.log(err);
            return res.status(400).send('Try again ')
        }
    },
    logout : async (req, res) => {
        try {
            res.clearCookie('token');
            return res.json({message: 'Sign out Success'});
        }
        catch(err) {
            console.log(err);
            return res.status(400).send('Try again ')
        }
    },
    currentUser : async (req, res) => {
        try {
            console.log(req._id+"");
            const user = await User.findById(req._id).select("-password").exec();
            console.log("CURRENT_USER", req._id);
            return res.json({ok:true});
        }
        catch(err) {
            console.log(err.message);
            return res.status(400).send(err.message)
        }
    },
    forgotPassword: async (req,res) => {
        try {
            const { email } = req.body;
            // console.log(email);
            const shortCode = nanoid(6).toUpperCase();
            const user = await User.findOneAndUpdate(
                { email },
                { passwordResetCode: shortCode }
            );
            if (!user) return res.status(400).send("User not found");

            // prepare for email
            const params = {
                Source: process.env.EMAIL_FROM,
                Destination: {
                    ToAddresses: [email],
                },
                Message: {
                    Body: {
                        Html: {
                            Charset: "UTF-8",
                            Data: `
                <html>
                  <h1>Reset password</h1>
                  <p>User this code to reset your password</p>
                  <h2 style="color:red;">${shortCode}</h2>
                  <i>from Ayush</i>
                </html>
              `,
                        },
                    },
                    Subject: {
                        Charset: "UTF-8",
                        Data: "Reset Password",
                    },
                },
            };

            const emailSent = SES.sendEmail(params).promise();
            emailSent
                .then((data) => {
                    console.log(data);
                    res.json({ ok: true });
                })
                .catch((err) => {
                    console.log(err);
                });
        } catch (err) {
            console.log(err);
        }
    }    ,
    resetPassword: async (req,res) => {
        try {
            const { email, code, newPassword } = req.body;
            // console.table({ email, code, newPassword });
            const hashedPassword = await hashPassword(newPassword);

            const user = User.findOneAndUpdate(
                {
                    email,
                    passwordResetCode: code,
                },
                {
                    password: hashedPassword,
                    passwordResetCode: "",
                }
            ).exec();
            res.json({ ok: true });
        } catch (err) {
            console.log(err);
            return res.status(400).send("Error! Try again.");
        }
    }
}