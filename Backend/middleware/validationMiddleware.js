const { body, validationResult } = require('express-validator');

// Validation middleware for registration
const validateRegister = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 3 })
    .withMessage('Name must be at least 3 characters long'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('role')
    .optional()
    .isIn(['customer', 'business', 'admin'])
    .withMessage('Invalid role'),
];

// Validation middleware for login
const validateLogin = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

// Validation middleware for updating profile
const validateUpdateProfile = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 3 })
    .withMessage('Name must be at least 3 characters long'),
  body('phone')
    .optional()
    .matches(/^[0-9\-\+\(\)\s]+$/)
    .withMessage('Invalid phone number'),
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email'),
];

// Validation middleware for business registration
const validateBusinessRegister = [
  body('businessName')
    .trim()
    .notEmpty()
    .withMessage('Business name is required')
    .isLength({ min: 3 })
    .withMessage('Business name must be at least 3 characters long'),
  body('businessEmail')
    .trim()
    .notEmpty()
    .withMessage('Business email is required')
    .isEmail()
    .withMessage('Please provide a valid business email'),
  body('businessPhone')
    .trim()
    .notEmpty()
    .withMessage('Business phone is required')
    .matches(/^[0-9\-\+\(\)\s]+$/)
    .withMessage('Invalid phone number'),
  body('registrationNumber')
    .trim()
    .notEmpty()
    .withMessage('Registration number is required'),
];

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((err) => ({
        field: err.param,
        message: err.msg,
      })),
    });
  }
  next();
};

module.exports = {
  validateRegister,
  validateLogin,
  validateUpdateProfile,
  validateBusinessRegister,
  handleValidationErrors,
};
