import { body, validationResult } from 'express-validator';

// Middleware for validating request data
const validateRequest = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    res.status(400).json({ error : errors.array()[0].msg});
  };
};

const validateRegister = [
  body('eMail').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
    .matches(/[0-9]/).withMessage('Password must contain a number')
    .matches(/[a-z]/).withMessage('Password must contain a lowercase letter')
    .matches(/[A-Z]/).withMessage('Password must contain an uppercase letter')
    .matches(/[!@#$%^&*(),.?"':;{}|<>-_]/).withMessage('Password must contain a special character'),
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('country').notEmpty().withMessage('Country is required'),
  body('role').isIn(['Owner', 'Worker']).withMessage('Role must be either owner or worker'),
  body('phoneNumber').matches(/^\+?[1-9]\d{1,14}$/).withMessage('Phone number must be in the correct international format'),
];


const validateLogin = [
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required')
];

export { 
  validateRequest,
  validateRegister,
  validateLogin
};
