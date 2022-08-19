type generalValidationProps = {
  username?: string;
  password?: string;
  email?: string;
}

const known_keywords = {
  username: {
    maxLength: 40,
    minLength: 2,
  },
  email: {
    maxLength: 266,
    minLength: 3, 
    regex: /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/
  },
  password: {
    maxLength: 40,
    minLength: 8,
  }
};

class generalValidation { 
  private known_keywords;
  constructor() {
    this.known_keywords = known_keywords;
  }

  public validate_keywords(given_keywords: generalValidationProps) {
    const errors: generalValidationProps = {};
    let valid = true;
    for (const key in given_keywords) {
      const given_key = given_keywords[key];
      const key_attributes = this.known_keywords[key];
      
      errors[key] = {};

      if (given_key.trim() === "") {
        errors[key].lengthError = `${key} must not be empty`;
      }
      
      if (key_attributes.regex && !given_key.match(key_attributes.regex)) {
        errors[key].formattingError = `${key} formatting is invalid`;
      }
      
      if (given_key.length < key_attributes.minLength) {
        errors[key].lengthError = `${key} is shorter than ${key_attributes.minLength} characters`;
      }
      else if (given_key.length > key_attributes.maxLength) {
        errors[key].lengthError = `${key} is greater than ${key_attributes.maxLength} characters`;
      }
      
      if (errors[key] === {}) {
        valid = false;
      }
    }

    return {
      errors: errors,
      valid: valid
    };
  }
}

const validation = new generalValidation();

export const validateRegisterInput = ({
  username,
  email,
  password
}: generalValidationProps) => {
  return validation.validate_keywords({
    username: username,
    email: email,
    password: password
  });
};

export const validateLoginInput = ({ username, password }: generalValidationProps) => {
  return validation.validate_keywords({
    username: username,
    password: password
  });
};
