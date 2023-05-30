const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    console.log(token.split(" ")[1]);
    const verify = jwt.verify(token.split(" ")[1], "secret ket");
    if (verify.userType === "RL_CUSTOMER") {
      next();
    } else {
      return res.status(408).json({
        msg: "Unauthorized Access",
      });
    }
  } catch (e) {
    return res.status(401).json({
      msg: "Invalid Request",
    });
  }
};
