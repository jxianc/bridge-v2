import { FieldError } from "../utils/common";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Int,
  Mutation,
  ObjectType,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { isAuth } from "../middleware/isAuth";
import { MyContext } from "../MyContext";
import { User } from "../entity/User";
import { Comment } from "../entity/Comment";
import { Post } from "../entity/Post";

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

@Resolver()
export class CommentResolver {
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
