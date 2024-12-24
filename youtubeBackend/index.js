const express = require("express") ;
const cors = require("cors") ;
const dotenv = require("dotenv") ;
const {connectDB} = require("./config/db.js") ;
const morgan = require("morgan") ;
const router = require("./routes/routes.js") ;
const cookieParser = require("cookie-parser") ;

dotenv.config(); //for environement variables

const app = express(); // express app

//database connection
connectDB();

//middlewares
app.use(cookieParser()); //for cookies
app.use(express.urlencoded({ extended: true })); //to accept url encoded data
app.use(express.json()); //to accept json data
app.use(morgan("tiny")); //for logging
app.use(cors({
    credentials : true,
    origin:"http://localhost:5173"
}));


//routes
app.get("/", (req, res) => {
    res.send("Welcome to My Youtube Backend!");
})

app.use("/api", router);

app.listen(3000, () => {
    console.log("Server Started at http://localhost:3000");
});