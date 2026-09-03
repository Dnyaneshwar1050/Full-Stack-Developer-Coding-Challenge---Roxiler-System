// Centralized validation helpers (no external validation libs)

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.{8,16}$)(?=.*[A-Z])(?=.*[^A-Za-z0-9]).*$/;

function validateName(name) {
  const errors = [];
  if (!name) errors.push('Name is required');
  else if (name.length < 20) errors.push('Name must be at least 20 characters');
  else if (name.length > 60) errors.push('Name must be at most 60 characters');
  return errors;
}

function validateAddress(address) {
  const errors = [];
  if (!address) errors.push('Address is required');
  else if (address.length > 400) errors.push('Address must be at most 400 characters');
  return errors;
}

function validateEmail(email) {
  const errors = [];
  if (!email) errors.push('Email is required');
  else if (!emailRegex.test(email)) errors.push('Email is invalid');
  return errors;
}

function validatePassword(password) {
  const errors = [];
  if (!password) errors.push('Password is required');
  else if (!passwordRegex.test(password)) errors.push('Password must be 8-16 characters, include at least one uppercase letter and one special character');
  return errors;
}

function validateRatingValue(rating) {
  const errors = [];
  const n = Number(rating);
  if (!rating && rating !== 0) errors.push('Rating is required');
  else if (!Number.isInteger(n) || n < 1 || n > 5) errors.push('Rating must be an integer between 1 and 5');
  return errors;
}

function collectErrors(list) {
  return list.flat().filter(Boolean);
}

function validateSignup(payload) {
  const errs = [];
  errs.push(...validateName(payload.name || ''));
  errs.push(...validateEmail(payload.email || ''));
  errs.push(...validateAddress(payload.address || ''));
  errs.push(...validatePassword(payload.password || ''));
  return collectErrors(errs);
}

function validateLogin(payload) {
  const errs = [];
  errs.push(...validateEmail(payload.email || ''));
  if (!payload.password) errs.push('Password is required');
  return collectErrors(errs);
}

module.exports = {
  validateName,
  validateAddress,
  validateEmail,
  validatePassword,
  validateRatingValue,
  validateSignup,
  validateLogin,
};
