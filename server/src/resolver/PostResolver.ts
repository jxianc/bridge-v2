import { Post } from "../entity/Post";
import { PostCategory } from "../entity/PostCategory";
import { isAuth } from "../middleware/isAuth";
import { postValidator } from "../utils/postValidator";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { FieldError } from "../utils/common";
import { MyContext } from "../MyContext";
import { User } from "../entity/User";
import { getConnection } from "typeorm";

@ObjectType()
class PostResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => Post, { nullable: true })
  post?: Post;
}

@InputType()
export class PostInput {
  @Field(() => Int, { nullable: true })
  postId?: number;

  @Field({ nullable: false })
  title: string;

  @Field({ nullable: false })
  body: string;

  @Field(() => Int, { nullable: false })
  postCategoryId: number;
}

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  @UseMiddleware(isAuth)
  async posts() {
    return await Post.find({ relations: ["user"] });
  }

  @Mutation(() => PostResponse)
  @UseMiddleware(isAuth)
  async createPost(
    @Arg("postInput") { title, body, postCategoryId }: PostInput,
    @Ctx() { req }: MyContext
  ): Promise<PostResponse> {
    const userId = req.session!.userId;
    const user = await User.findOne({ id: userId });
    if (!user) {
      throw new Error("not authenticated");
    }

    const errors = postValidator({ title, body, postCategoryId });
    if (errors) {
      return { errors };
    }

    const postCategory = await PostCategory.findOne({ id: postCategoryId });
    if (!postCategory) {
      return {
        errors: [
          {
            field: "postCategory",
            message: "category not found",
          },
        ],
      };
    }

    const post = await Post.create({
      title,
      body,
      user,
      postCategory,
    }).save();

    return {
      post,
    };
  }

  @Mutation(() => PostResponse)
  @UseMiddleware(isAuth)
  async editPost(
    @Arg("postInput") { postId, title, body, postCategoryId }: PostInput,
    @Ctx() { req }: MyContext
  ): Promise<PostResponse> {
    const userId = req.session!.userId;
    const user = await User.findOne({ id: userId });
    if (!user) {
      throw new Error("not authenticated");
    }

    const existingPost = await Post.findOne({
      where: { id: postId },
      relations: ["user"],
    });
    if (!existingPost) {
      return {
        errors: [
          {
            field: "post",
            message: "post not found",
          },
        ],
      };
    }

    if (existingPost.user.id !== user.id) {
      return {
        errors: [
          {
            field: "post",
            message: "you are not the author",
          },
        ],
      };
    }

    const errors = postValidator({ title, body, postCategoryId });
    if (errors) {
      return { errors };
    }

    const postCategory = await PostCategory.findOne({ id: postCategoryId });
    if (!postCategory) {
      return {
        errors: [
          {
            field: "postCategory",
            message: "category not found",
          },
        ],
      };
    }

    await getConnection()
      .createQueryBuilder()
      .update(Post)
      .set({ title, body, postCategory })
      .where("id = :id and user.id = :userId", { id: postId, userId })
      .returning("*")
      .execute();

    const post = await Post.findOne({
      where: { id: postId },
      relations: ["user", "postCategory"],
    });
    return {
      post,
    };
  }
}
