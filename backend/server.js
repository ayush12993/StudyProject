const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
dotenv.config();
const  app = express();
var bodyParser = require('body-parser');
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

//csrf protection
const csrfProtection = csrf({cookie: true});

//db
mongoose.connect(process.env.DATABASE, {

 useUnifiedTopology: true,
}).then(() => console.log("DB connections established"))
    .catch(err => console.error(err));

//routes
fs.readdirSync("./routes").map((r) =>
  app.use('/api', require(`./routes/${r}`))
);

app.use(csrfProtection);

app.get("/api/csrf-token", (req, res) => {
 res.json({csrfToken: req.csrfToken()});

})

//port

 const port = process.env.PORT || 8000;
app.listen(port, () => console.log("port is running on " + port));