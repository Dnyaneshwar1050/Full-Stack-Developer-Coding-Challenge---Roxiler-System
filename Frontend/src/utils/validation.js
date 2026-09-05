// Frontend validation helpers matching backend requirements

export const validateName = (name) => {
  if (!name || !name.trim()) {
    return 'Name is required';
  }
  const length = name.trim().length;
  if (length < 20 || length > 60) {
    return 'Name must be between 20 and 60 characters';
  }
  return '';
};

export const validateEmail = (email) => {
  if (!email || !email.trim()) {
    return 'Email is required';
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return 'Please enter a valid email address';
  }
  return '';
};

export const validatePassword = (password) => {
  if (!password) {
    return 'Password is required';
  }
  if (password.length < 8 || password.length > 16) {
    return 'Password must be between 8 and 16 characters';
  }
  const hasUpperCase = /[A-Z]/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);

  if (!hasUpperCase) {
    return 'Password must include at least 1 uppercase letter';
  }
  if (!hasSpecialChar) {
    return 'Password must include at least 1 special character';
  }
  return '';
};

export const validateAddress = (address) => {
  if (!address || !address.trim()) {
    return 'Address is required';
  }
  if (address.trim().length > 400) {
    return 'Address must not exceed 400 characters';
  }
  return '';
};

export const validateRating = (rating) => {
  const num = Number(rating);
  if (!Number.isInteger(num) || num < 1 || num > 5) {
    return 'Rating must be an integer between 1 and 5';
  }
  return '';
};
