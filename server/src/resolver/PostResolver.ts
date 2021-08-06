import { PostPoint } from "../entity/PostPoint";
import {
  Arg,
  Ctx,
  Field,
  FieldResolver,
  InputType,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from "type-graphql";
import { getConnection } from "typeorm";
import { Post } from "../entity/Post";
import { PostCategory } from "../entity/PostCategory";
import { User } from "../entity/User";
import { isAuth } from "../middleware/isAuth";
import { MyContext } from "../MyContext";
import { FieldError } from "../utils/common";
import { postValidator } from "../utils/postValidator";

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

@Resolver(Post)
export class PostResolver {
  @FieldResolver(() => User)
  user(@Root() post: Post, @Ctx() { userLoader }: MyContext) {
    return userLoader.load(post.userId);
  }

  @FieldResolver(() => Int, { nullable: true })
  async voteStatus(@Root() post: Post, @Ctx() { req }: MyContext) {
    if (!req.session!.userId) {
      return null;
    }
    // const postPoint = await postPointLoader.load({
    //   postId: post.id,
    //   userId: req.session!.userId,
    // });

    // return postPoint ? postPoint.value : null;
    const postPoint = await PostPoint.findOne({
      where: { postId: post.id, userId: req.session!.userId },
    });

    return postPoint ? postPoint.value : null;
  }

  @Query(() => PostResponse)
  async singlePost(
    @Arg("postId", () => Int) postId: number
  ): Promise<PostResponse> {
    const post = await Post.findOne({
      where: { id: postId },
      relations: ["postCategory", "comments", "comments.user"],
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
      .createQueryBuilder("post")
      .where(cursor ? `post."createdAt" < :cursor` : "", {
        cursor: new Date(parseInt(cursor as string)),
      })
      // .leftJoinAndSelect("post.user", "user")
      .leftJoinAndSelect("post.postCategory", "postCategory")
      .leftJoinAndSelect("post.comments", "comment")
      .orderBy("post.createdAt", "DESC")
      .take(actualLimitPlusOne)
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
      .createQueryBuilder("post")
      .where(
        cursor
          ? `post."createdAt" < :cursor and post."postCategoryId" = :categoryId `
          : `post."postCategoryId" = :categoryId`,
        {
          cursor: new Date(parseInt(cursor as string)),
          categoryId,
        }
      )
      // .leftJoinAndSelect("post.user", "user")
      .leftJoinAndSelect("post.postCategory", "postCategory")
      .leftJoinAndSelect("post.comments", "comment")
      .orderBy("post.createdAt", "DESC")
      .take(actualLimitPlusOne)
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

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deletePost(
    @Arg("postId", () => Int) postId: number,
    @Ctx() { req }: MyContext
  ): Promise<boolean> {
    await Post.delete({ id: postId, userId: req.session!.userId });
    return true;
  }
}
