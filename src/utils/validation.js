const validator = require("validator");

const signupValidation = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName) {
    throw new Error("First Name is Required");
  }

  if (firstName.length < 4 || firstName.length > 50) {
    throw new Error("First Name should be 4-50 characters");
  }

  if (!lastName) {
    throw new Error("Last Name is Required");
  }

  if (lastName.length < 4 || lastName.length > 50) {
    throw new Error("Last Name should be 4-50 characters");
  }

  if (!emailId) {
    throw new Error("Email Id is required");
  }

  if (!validator.isEmail(emailId)) {
    throw new Error("Invalid EmailId");
  }

  if (!password) {
    throw new Error("Password is required");
  }

  if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter strong password");
  }
};

module.exports = {
  signupValidation,
};
