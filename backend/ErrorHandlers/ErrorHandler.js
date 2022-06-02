const Errorresponse = require("./Errorresponse");
module.exports = (err, req, res, next) => {
    err.statuscode = err.statuscode || 500;
    err.message = err.message || "internal server error";

   
    
    if (err.name === "CastError") {
        const message = `resorces not found invalid ${err.path} `;
        err = new Errorresponse(message, 400);
      }
    
      // mongoose dublicate key error
    
      if (err.code === 11000) {
        const message = `Dublicate ${Object.keys(err.keyValue)} Entered `;
        err = new Errorresponse(message, 400);
      }

res.status(err.statuscode).json({ success: false, error: err.message });
}

