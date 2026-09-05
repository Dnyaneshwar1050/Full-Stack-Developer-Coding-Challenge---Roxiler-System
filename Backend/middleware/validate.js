const { validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorList = errors.array().map((err) => err.msg);
    return res.status(400).json({
      message: errorList[0],
      errors: errorList,
    });
  }
  next();
};

module.exports = validate;
