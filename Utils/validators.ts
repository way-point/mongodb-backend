type RegisterInputProps = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type LoginInputProps = {
  username: string;
  password: string;
};

export const validateRegisterInput = ({
  username,
  email,
  password,
  confirmPassword,
}: RegisterInputProps) => {
  const errors: RegisterInputProps = { username: "", email: "", password: "", confirmPassword: "" };
  if (username.trim() === "") {
    errors.username = "Username must not be empty";
  }
  if (email.trim() === "") {
    errors.email = "Email must not be empty";
  } else {
    const regEx =
      /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
    if (!email.match(regEx)) {
      errors.email = "Email must be a valid email address";
    }
  }
  if (password === "") {
    errors.password = "Password must not empty";
  } else if (password !== confirmPassword) {
    errors.confirmPassword = "Passwords must match";
  }

  return {
    errors,
    valid: !errors.confirmPassword || !errors.email || !errors.password || !errors.username,
  };
};

export const validateLoginInput = ({ username, password }: LoginInputProps) => {
  const errors: LoginInputProps = { username: "", password: "" };
  if (username.trim() === "") {
    errors.username = "Username must not be empty";
  }
  if (password.trim() === "") {
    errors.password = "Password must not be empty";
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};
