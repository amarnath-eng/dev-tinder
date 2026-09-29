const validateProfileEdit = (keys, req) => {
  keys.forEach((key) => {
    if (key === "age") {
      const { age } = req.body;

      if (typeof age !== "number" || !Number.isFinite(age)) {
        throw new Error("Age is invalid or can't be empty");
      }
      if (age <= 0) {
        throw new Error("Age must be greater than 0");
      }
    }

    if (key === "gender") {
      const { gender } = req.body;

      const ALLOWED_VALUES = ["male", "female", "others"];

      if (!gender) {
        throw new Error("Gender is invalid or can't be empty");
      }

      if (!ALLOWED_VALUES.includes(gender)) {
        throw new Error(
          "Gender: " + ALLOWED_VALUES.join(", ") + " are allowed",
        );
      }
    }

    if (key === "photoUrl") {
      const { photoUrl } = req.body;

      if (!photoUrl) {
        throw new Error("Photo Url is invalid or can't be empty");
      }
    }

    if (key === "skills") {
      const { skills } = req.body;

      if (!Array.isArray(skills)) {
        throw new Error("Invalid Skills");
      }
      if (!skills.length) {
        throw new Error("Skills can't be empty");
      }
    }
  });
};

const getUpdatableKeys = (req) => {
  const ALLOWED_FIELDS = ["age", "gender", "photoUrl", "skills"];

  const nonUpdatableKeys = [];

  const updatableKeys = [];

  Object.keys(req.body).forEach((key) =>
    !ALLOWED_FIELDS.includes(key)
      ? nonUpdatableKeys.push(key)
      : updatableKeys.push(key),
  );

  const nonUpdatableErrorMessage = [];

  if (nonUpdatableKeys.length) {
    nonUpdatableKeys.forEach((key) => {
      nonUpdatableErrorMessage.push(key + " is not allowed");
    });

    throw new Error(nonUpdatableErrorMessage.join(", "));
  }

  validateProfileEdit(updatableKeys, req);

  return updatableKeys;
};

module.exports = {
  getUpdatableKeys,
};
