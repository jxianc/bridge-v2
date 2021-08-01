import { UserInput } from "src/resolver/UserResolver";

export const registerValidator = ({
  username,
  email,
  password,
  confirmPassword,
}: UserInput) => {
  if (username.length <= 2) {
    return [
      {
        field: "username",
        message: "length must be greater than 2",
      },
    ];
  }
  if (username.includes("@")) {
    return [
      {
        field: "username",
        message: "username cannot include @",
      },
    ];
  }
  if (!email.includes("@")) {
    return [
      {
        field: "email",
        message: "invalid email",
      },
    ];
  }
  if (password.length <= 5) {
    return [
      {
        field: "password",
        message: "length must be greater than 5",
      },
    ];
  }
  if (password !== confirmPassword) {
    return [
      {
        field: "confirmPassword",
        message: "passwords do not match",
      },
    ];
  }

  return null;
};
