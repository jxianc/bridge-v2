import DataLoader from "dataloader";
import { PostPoint } from "../entity/PostPoint";

export const createPostPointLoader = () =>
  new DataLoader<{ postId: number; userId: number }, PostPoint | null>(
    async (keys) => {
      const postPoints = await PostPoint.findByIds(keys as any);
      const postPointIdsToPostPoint: Record<string, PostPoint | null> = {};

      // const postPoints = keys.map(async (key) => {
      //   return await PostPoint.findOne({
      //     where: { postId: key.postId, userId: key.userId },
      //   });
      // });
      postPoints.forEach((postPoint) => {
        postPointIdsToPostPoint[`${postPoint.postId}|${postPoint.userId}`] =
          postPoint;
      });

      return keys.map((key) => {
        return postPointIdsToPostPoint[`${key.postId}|${key.userId}`];
      });
    }
  );
