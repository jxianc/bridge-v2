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

@ObjectType()
class PaginatedPosts {
  @Field(() => [Post])
  posts: Post[];

  @Field()
  hasMore: boolean;
}

@Resolver()
export class PostResolver {
  @Query(() => PostResponse)
  async singlePost(
    @Arg("postId", () => Int) postId: number
  ): Promise<PostResponse> {
    const post = await Post.findOne({
      where: { id: postId },
      relations: ["user", "postCategory", "comments"],
    });
    if (!post) {
      return {
        errors: [
          {
            field: "postId",
            message: "post not found",
          },
        ],
      };
    }

    return { post };
  }

  @Query(() => PaginatedPosts)
  async posts(
    @Arg("limit", () => Int) limit: number,
    @Arg("cursor", () => String, { nullable: true }) cursor: string | null
  ): Promise<PaginatedPosts> {
    const actualLimit = Math.min(50, limit);
    const actualLimitPlusOne = actualLimit + 1;

    const posts = await getConnection()
      .getRepository(Post)
      .createQueryBuilder("p")
      .where(cursor ? `p."createdAt" < :cursor` : "", {
        cursor: new Date(parseInt(cursor as string)),
      })
      .leftJoinAndSelect("p.user", "user")
      .leftJoinAndSelect("p.postCategory", "postCategory")
      .orderBy(`p."createdAt"`, "DESC")
      .limit(actualLimitPlusOne)
      .getMany();

    return {
      posts: posts.slice(0, actualLimit),
      hasMore: posts.length === actualLimitPlusOne,
    };
  }

  @Query(() => PaginatedPosts)
  async postsByCategory(
    @Arg("categoryId", () => Int) categoryId: number,
    @Arg("limit", () => Int) limit: number,
    @Arg("cursor", () => String, { nullable: true }) cursor: string | null
  ): Promise<PaginatedPosts> {
    const actualLimit = Math.min(50, limit);
    const actualLimitPlusOne = actualLimit + 1;

    const posts = await getConnection()
      .getRepository(Post)
      .createQueryBuilder("p")
      .where(
        cursor
          ? `p."createdAt" < :cursor and p."postCategoryId" = :categoryId `
          : `p."postCategoryId" = :categoryId`,
        {
          cursor: new Date(parseInt(cursor as string)),
          categoryId,
        }
      )
      .leftJoinAndSelect("p.user", "user")
      .leftJoinAndSelect("p.postCategory", "postCategory")
      .orderBy(`p."createdAt"`, "DESC")
      .limit(actualLimitPlusOne)
      .getMany();

    return {
      posts: posts.slice(0, actualLimit),
      hasMore: posts.length === actualLimitPlusOne,
    };
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
