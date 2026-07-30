export const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const isStrongPassword = (password) => password.length >= 8;

export const validateRegisterForm = ({ name, email, password }) => {
  const errors = {};
  if (!name?.trim()) errors.name = 'Name is required';
  if (!isValidEmail(email)) errors.email = 'Enter a valid email address';
  if (!isStrongPassword(password)) errors.password = 'Password must be at least 8 characters';
  return errors;
};
