const { body, param } = require('express-validator');

// Password requirement: 8-16 characters, 1 uppercase letter, 1 special character
const passwordRegex = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9])/;

// 1. Signup / Register
const signupRules = [
  body('name')
    .trim()
    .isLength({ min: 20, max: 60 })
    .withMessage('Name must be between 20 and 60 characters'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 8, max: 16 })
    .withMessage('Password must be 8-16 characters')
    .matches(passwordRegex)
    .withMessage('Password must include at least 1 uppercase letter and 1 special character'),
  body('address')
    .trim()
    .isLength({ min: 1, max: 400 })
    .withMessage('Address must not exceed 400 characters'),
];

// 2. Login
const loginRules = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Valid email is required'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

// 3. Change Password
const changePasswordRules = [
  body('newPassword')
    .isLength({ min: 8, max: 16 })
    .withMessage('Password must be 8-16 characters')
    .matches(passwordRegex)
    .withMessage('Password must include at least 1 uppercase letter and 1 special character'),
];

// 4. Create Store
const createStoreRules = [
  body('name')
    .trim()
    .isLength({ min: 20, max: 60 })
    .withMessage('Store name must be between 20 and 60 characters'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Valid store email is required'),
  body('address')
    .trim()
    .isLength({ min: 1, max: 400 })
    .withMessage('Address must not exceed 400 characters'),
];

// 5. Submit Rating
const rateStoreBodyRules = [
  body('storeId')
    .notEmpty()
    .withMessage('Store ID is required'),
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be an integer between 1 and 5'),
];

// 6. Update Rating
const updateRateStoreRules = [
  param('storeId')
    .notEmpty()
    .withMessage('Store ID is required'),
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be an integer between 1 and 5'),
];

module.exports = {
  signupRules,
  loginRules,
  changePasswordRules,
  createStoreRules,
  rateStoreBodyRules,
  updateRateStoreRules,
};
