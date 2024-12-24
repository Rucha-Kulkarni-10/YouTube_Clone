const jwt = require("jsonwebtoken");

const tokenAuthenticator = (req, res, next) => {
  try {
    const token = req.cookies.authtoken; //getting the token from the cookie

    //checking if the token exists
    if (!token) {
      return res
        .status(401)
        .json({
          message: "Unauthorized : You must login first",
          success: false,
        });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET); //verifying the token
    req.user = decoded; //storing the decoded token in the request
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Unauthorized :invalid token", success: false });
  }
};

module.exports = {
    tokenAuthenticator
}