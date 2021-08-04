import { CommentPoint } from "../entity/CommentPoint";
import { Arg, Ctx, Int, Mutation, Resolver, UseMiddleware } from "type-graphql";
import { getManager } from "typeorm";
import { Comment } from "../entity/Comment";
import { User } from "../entity/User";
import { isAuth } from "../middleware/isAuth";
import { MyContext } from "../MyContext";
import { PointResponse } from "./PostPointResolver";

@Resolver()
export class CommentPointResolver {
  @Mutation(() => PointResponse)
  @UseMiddleware(isAuth)
  async voteComment(
    @Arg("commentId", () => Int) commentId: number,
    @Arg("isUpvote") isUpvote: boolean,
    @Ctx() { req }: MyContext
  ): Promise<PointResponse> {
    const userId = req.session!.userId;
    const user = await User.findOne({ id: userId });
    const comment = await Comment.findOne({ id: commentId });
    if (!comment) {
      return {
        errors: [
          {
            field: "post",
            message: "comment not found",
          },
        ],
        success: false,
      };
    }

    const existingPoint = await CommentPoint.findOne({
      where: {
        comment: { id: commentId },
        user: { id: userId },
      },
      relations: ["comment", "user"],
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
            await CommentPoint.remove(existingPoint);
            comment.points = comment.points + 1;
            await comment.save();
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
            await CommentPoint.remove(existingPoint);
            comment.points = comment.points - 1;
            await comment.save();
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
        await CommentPoint.create({
          isDecrement: !isUpvote,
          user,
          comment,
        }).save();
        if (isUpvote) {
          // upvote - increase comment point
          comment.points = comment.points + 1;
        } else {
          // downvote - decrease post point
          comment.points = comment.points - 1;
        }
        await comment.save();
        result = {
          success: true,
        };
      }
    });

    return result;
  }
}
