import { validate } from "graphql";

type RegisterInputProps = {
  username: string;
  email: string;
  password: string;
};

type LoginInputProps = {
  username: string;
  password: string;
};

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
}

class generalValidation { 
  private known_keywords;
  constructor() {
    this.known_keywords = known_keywords;
  }

  public validate_keywords(given_keywords: generalValidationProps) {
    const errors: generalValidationProps = {}
    var valid: boolean = true;
    for (var key in given_keywords) {
      let given_key = given_keywords[key]
      let key_attributes = this.known_keywords[key];
      if (given_key.trim() === "") {
        errors[key] = `${key} must not be empty`;
      }
      
      if (key_attributes.regex && !given_key.match(key_attributes.regex)) {
        errors[key] = `${key} formatting is invalid`;
      }
      
      if (given_key.length < key_attributes.minLength) {
        errors[key] = `${key} is shorter than ${key_attributes.minLength} characters`;
      }

      if (given_key.length > key_attributes.maxLength) {
        errors[key] = `${key} is greater than ${key_attributes.maxLength} characters`;
      }

      if (!errors[key]) {
        errors[key] = "";
      }
      else {
        valid = false;
      }
    }

    return {
      errors: errors,
      valid: valid
    }
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
  })
}

export const validateLoginInput = ({ username, password }: LoginInputProps) => {
  return validation.validate_keywords({
    username: username,
    password: password
  })
}
