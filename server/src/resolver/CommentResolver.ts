import { FieldError } from "../utils/common";
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
import { isAuth } from "../middleware/isAuth";
import { MyContext } from "../MyContext";
import { User } from "../entity/User";
import { Comment } from "../entity/Comment";
import { Post } from "../entity/Post";
import { getConnection } from "typeorm";
import { CommentPoint } from "../entity/CommentPoint";

@ObjectType()
class CommentResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => Comment, { nullable: true })
  comment?: Comment;
}

@InputType()
export class CommentInput {
  @Field(() => Int, { nullable: true })
  commentId?: number;

  @Field({ nullable: false })
  body: string;

  @Field(() => Int, { nullable: false })
  postId: number;
}

@ObjectType()
class PaginatedComments {
  @Field(() => [Comment])
  comments: Comment[];

  @Field()
  hasMore: boolean;
}

@Resolver(Comment)
export class CommentResolver {
  @FieldResolver(() => User)
  user(@Root() comment: Comment, @Ctx() { userLoader }: MyContext) {
    return userLoader.load(comment.userId);
  }

  @FieldResolver(() => Int, { nullable: true })
  async voteStatus(@Root() comment: Comment, @Ctx() { req }: MyContext) {
    if (!req.session!.userId) {
      return null;
    }

    const commentPoint = await CommentPoint.findOne({
      where: { commentId: comment.id, userId: req.session!.userId },
    });

    return commentPoint ? commentPoint.value : null;
  }

  @Query(() => PaginatedComments)
  async commentsByPost(
    @Arg("postId", () => Int) postId: number,
    @Arg("limit", () => Int) limit: number,
    @Arg("cursor", () => String, { nullable: true }) cursor: string | null
  ): Promise<PaginatedComments> {
    const actualLimit = Math.min(50, limit);
    const actualLimitPlusOne = actualLimit + 1;

    const comments = await getConnection()
      .getRepository(Comment)
      .createQueryBuilder("comment")
      .where(
        cursor
          ? `comment."createdAt" < :cursor and comment."postId" = :postId `
          : `comment."postId" = :postId`,
        {
          cursor: new Date(parseInt(cursor as string)),
          postId,
        }
      )
      // .leftJoinAndSelect("comment.user", "user")
      .orderBy("comment.createdAt", "DESC")
      .take(actualLimitPlusOne)
      .getMany();

    return {
      comments: comments.slice(0, actualLimit),
      hasMore: comments.length === actualLimitPlusOne,
    };
  }

  @Mutation(() => CommentResponse)
  @UseMiddleware(isAuth)
  async createComment(
    @Arg("commnetInput") { body, postId }: CommentInput,
    @Ctx() { req }: MyContext
  ): Promise<CommentResponse> {
    const userId = req.session!.userId;
    const user = await User.findOne({ id: userId });
    if (!user) {
      throw new Error("not authenticated");
    }

    if (body.length <= 5) {
      return {
        errors: [
          {
            field: "body",
            message: "length must be greater than 5",
          },
        ],
      };
    }

    const post = await Post.findOne({ id: postId });
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

    const comment = await Comment.create({
      body,
      user,
      post,
    }).save();

    return {
      comment,
    };
  }
}
