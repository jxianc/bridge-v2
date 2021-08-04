import { Post } from "../entity/Post";
import { isAuth } from "../middleware/isAuth";
import { MyContext } from "../MyContext";
import { FieldError } from "../utils/common";
import {
  Arg,
  Ctx,
  Field,
  Int,
  Mutation,
  ObjectType,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { PostPoint } from "../entity/PostPoint";
import { getManager } from "typeorm";
import { User } from "../entity/User";

@ObjectType()
export class PointResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field()
  success: boolean;
}

@Resolver()
export class PostPointResolver {
  @Mutation(() => PointResponse)
  @UseMiddleware(isAuth)
  async votePost(
    @Arg("postId", () => Int) postId: number,
    @Arg("isUpvote") isUpvote: boolean,
    @Ctx() { req }: MyContext
  ): Promise<PointResponse> {
    const userId = req.session!.userId;
    const user = await User.findOne({ id: userId });
    const post = await Post.findOne({ id: postId });
    if (!post) {
      return {
        errors: [
          {
            field: "post",
            message: "post not found",
          },
        ],
        success: false,
      };
    }

    const existingPoint = await PostPoint.findOne({
      where: {
        post: { id: postId },
        user: { id: userId },
      },
      relations: ["post", "user"],
    });

    let result: PointResponse = {
      success: false,
    };

    await getManager().transaction(async () => {
      if (existingPoint) {
        // user voted before
        if (isUpvote) {
          // is upvote
          if (existingPoint.isDecrement) {
            // is downvote previously
            await PostPoint.remove(existingPoint);
            post.points = post.points + 1;
            await post.save();
            result = {
              success: true,
            };
          } else {
            // is upvote previously
            result = {
              success: false,
              errors: [{ field: "point", message: "you can only upvote once" }],
            };
          }
        } else {
          // is downvote
          if (!existingPoint.isDecrement) {
            // is upvote previously
            await PostPoint.remove(existingPoint);
            post.points = post.points - 1;
            await post.save();
            result = {
              success: true,
            };
          } else {
            result = {
              success: false,
              errors: [
                { field: "point", message: "you can only downvote once" },
              ],
            };
          }
        }
      } else {
        // user never vote before
        await PostPoint.create({
          isDecrement: !isUpvote,
          user,
          post,
        }).save();
        if (isUpvote) {
          // upvote - increase post point
          post.points = post.points + 1;
        } else {
          // downvote - decrease post point
          post.points = post.points - 1;
        }
        await post.save();
        result = {
          success: true,
        };
      }
    });

    return result;
  }
}
