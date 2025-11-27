export const validateInputs = (
  value: string,
  type: string,
  value2?: string
): { status: boolean; message: string } => {
  if (!type || !value) {
    return { status: false, message: "This field is required" };
  }

  switch (type) {
    case "email": {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      const isValid = emailRegex.test(value);
      return isValid
        ? { status: true, message: "Valid email address" }
        : { status: false, message: "Invalid email address" };
    }
    case "password": {
      const isValid = value.length >= 8;
      return isValid
        ? { status: true, message: "Valid password" }
        : {
            status: false,
            message: "Password must be at least 8 characters long",
          };
    }
    case "password2": {
      const isValid = value === value2;
      return isValid
        ? { status: true, message: "Passwords matched" }
        : { status: false, message: "Passwords do not match" };
    }
    case "name": {
      const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/;
      const trimmedValue = value.trim();
      const isValid =
        trimmedValue.length > 0 &&
        trimmedValue.length <= 50 &&
        nameRegex.test(trimmedValue);
      return isValid
        ? { status: true, message: "Valid input" }
        : {
            status: false,
            message: "Invalid input",
          };
    }
    case "city": {
      const cityRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ.,' -]+$/;
      const trimmedValue = value.trim();
      const isValid =
        trimmedValue.length > 0 &&
        trimmedValue.length <= 50 &&
        cityRegex.test(trimmedValue);
      return isValid
        ? { status: true, message: "Valid input" }
        : {
            status: false,
            message:
              "Invalid city name. 1-100 characters containing only valid letters, spaces, and punctuation.",
          };
    }
    case "dob": {
      const dobRegex = /^\d{4}-\d{2}-\d{2}$/; // Checks for YYYY-MM-DD format
      const isValidDate = dobRegex.test(value);

      if (!isValidDate) {
        return {
          status: false,
          message: "Invalid date format. Use YYYY-MM-DD",
        };
      }

      // Check if the date is a valid calendar date
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        return { status: false, message: "Invalid date" };
      }

      /**
      // Check if the user is 18 years or older
      const today = new Date();
      const age = today.getFullYear() - date.getFullYear();
      const m = today.getMonth() - date.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < date.getDate())) {
        age--;
      }

      if (age < 18) {
        return { status: false, message: "You must be at least 18 years old." };
      }
      */
      return { status: true, message: "Valid date" };
    }
    default:
      return { status: false, message: "Invalid input type" };
  }
};
