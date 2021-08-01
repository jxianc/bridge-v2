import { PostInput } from "src/resolver/PostResolver";

export const postValidator = ({ title, body, postCategoryId }: PostInput) => {
  if (title.length <= 5) {
    return [
      {
        field: "title",
        message: "length must be greater than 5",
      },
    ];
  }
  if (body.length <= 5) {
    return [
      {
        field: "body",
        message: "length must be greater than 5",
      },
    ];
  }
  if (!postCategoryId) {
    return [
      {
        field: "postCategory",
        message: "please select a category",
      },
    ];
  }
  return null;
};
